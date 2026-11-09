import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestScenario } from './entities/test-scenario.entity';
import { TestRun } from './entities/test-run.entity';
import { TestStatus } from './enums/test-status.enum';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { PaymentsService } from '../payments/payments.service';
import { PolicyEngineService } from '../policy-engine/policy-engine.service';
import { ChaosLabService } from '../chaos-lab/chaos-lab.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { PaymentEventType } from '../monitoring/enums/payment-event-type.enum';

@Injectable()
export class TestingEngineService {
  private readonly logger = new Logger(TestingEngineService.name);

  constructor(
    @InjectRepository(TestScenario)
    private readonly scenarioRepo: Repository<TestScenario>,
    @InjectRepository(TestRun)
    private readonly runRepo: Repository<TestRun>,
    private readonly paymentsService: PaymentsService,
    private readonly policyEngine: PolicyEngineService,
    private readonly chaosLab: ChaosLabService,
    private readonly monitoring: MonitoringService,
  ) {}

  async createScenario(
    projectId: string,
    dto: CreateScenarioDto,
  ): Promise<TestScenario> {
    const scenario = this.scenarioRepo.create({ ...dto, projectId });
    return this.scenarioRepo.save(scenario);
  }

  async getScenario(id: string): Promise<TestScenario> {
    const scenario = await this.scenarioRepo.findOne({ where: { id } });
    if (!scenario) {
      throw new NotFoundException('Test scenario not found');
    }
    return scenario;
  }

  async listScenarios(projectId: string): Promise<TestScenario[]> {
    return this.scenarioRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async getRun(id: string): Promise<TestRun> {
    const run = await this.runRepo.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException('Test run not found');
    }
    return run;
  }

  async listRuns(projectId: string): Promise<TestRun[]> {
    return this.runRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  /**
   * Executes a scenario. The orchestration order follows the platform design:
   *   1. validate the planned payment against the policy engine
   *   2. apply any requested chaos-lab failure injection
   *   3. execute each step via the appropriate network adapter (TODO)
   *   4. record resulting payments (with duplicate detection)
   *   5. emit monitoring events for each outcome
   *
   * TODO: move long-running execution onto a Bull queue processor so retries and
   * backoff are handled reliably, and wire the real x402 / Stellar adapters.
   */
  async runScenario(
    projectId: string,
    scenarioId: string,
    dto: RunScenarioDto,
  ): Promise<TestRun> {
    const scenario = await this.getScenario(scenarioId);
    if (scenario.projectId !== projectId) {
      throw new NotFoundException('Test scenario not found');
    }

    const run = this.runRepo.create({
      scenarioId,
      projectId,
      status: TestStatus.RUNNING,
      startedAt: new Date(),
      config: dto,
    });
    await this.runRepo.save(run);

    const payments: any[] = [];
    const failures: any[] = [];
    const violations: any[] = [];
    let stepsPassed = 0;
    let stepsTotal = scenario.steps?.length ?? 0;
    let failed = false;

    try {
      // 1. Apply chaos-lab failure profile if requested.
      if (dto.failureProfileId) {
        const injected = await this.chaosLab.injectFailure(dto.failureProfileId);
        failures.push(injected);
      }

      // 2. Execute each step.
      for (const step of scenario.steps ?? []) {
        const paymentLike = {
          intentId: step.intentId,
          amount: step.amount,
          currency: step.currency,
          network: dto.adapter ?? step.network ?? 'x402-stellar',
        };

        const policyResult = await this.policyEngine.validatePayment(projectId, paymentLike);
        if (!policyResult.valid) {
          violations.push({ step, policyResult });
        }

        // TODO: replace with real adapter call via the adapters modules.
        const recorded = await this.paymentsService.record(projectId, {
          ...paymentLike,
          status: undefined as any,
        });
        payments.push({
          paymentId: recorded.payment.id,
          isDuplicate: recorded.duplicate.isDuplicate,
        });

        await this.monitoring.recordEvent(
          recorded.payment.id,
          recorded.duplicate.isDuplicate
            ? PaymentEventType.DUPLICATE_ATTEMPT
            : PaymentEventType.PAYMENT_RECORDED,
          { scenarioId, intentId: step.intentId },
        );

        stepsPassed++;
      }

      run.status = failed || violations.length > 0 ? TestStatus.FAILED : TestStatus.PASSED;
    } catch (err: any) {
      this.logger.error(`Run ${run.id} errored: ${err.message}`, err.stack);
      run.status = TestStatus.ERROR;
      failed = true;
    }

    run.result = {
      stepsTotal,
      stepsPassed,
      payments,
      failures,
      violations,
    };
    run.completedAt = new Date();

    return this.runRepo.save(run);
  }

  async cancelRun(id: string): Promise<TestRun> {
    const run = await this.getRun(id);
    run.status = TestStatus.CANCELLED;
    run.completedAt = new Date();
    return this.runRepo.save(run);
  }
}
