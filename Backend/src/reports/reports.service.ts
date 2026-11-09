import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportType } from './enums/report-type.enum';
import { GenerateReportDto } from './dto/generate-report.dto';
import { PaymentsService } from '../payments/payments.service';
import { TestingEngineService } from '../testing-engine/testing-engine.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { SettlementService } from '../settlement/settlement.service';

/**
 * Generates structured reliability reports by aggregating data from the
 * payments, testing engine, monitoring, and settlement modules.
 */
@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    private readonly paymentsService: PaymentsService,
    private readonly testingEngine: TestingEngineService,
    private readonly monitoring: MonitoringService,
    private readonly settlement: SettlementService,
  ) {}

  async generate(
    projectId: string,
    dto: GenerateReportDto,
    generatedBy?: string,
  ): Promise<Report> {
    const periodStart = dto.periodStart ? new Date(dto.periodStart) : undefined;
    const periodEnd = dto.periodEnd ? new Date(dto.periodEnd) : undefined;

    let data: Record<string, any>;
    switch (dto.type) {
      case ReportType.RELIABILITY_SUMMARY:
        data = await this.buildReliabilitySummary(projectId);
        break;
      case ReportType.FAILURE_ANALYSIS:
        data = await this.buildFailureAnalysis(projectId);
        break;
      case ReportType.POLICY_COMPLIANCE:
        data = await this.buildPolicyCompliance(projectId);
        break;
      case ReportType.SETTLEMENT_AUDIT:
        data = await this.buildSettlementAudit(projectId);
        break;
      case ReportType.DUPLICATE_PAYMENT_AUDIT:
        data = await this.buildDuplicateAudit(projectId);
        break;
      default:
        data = {};
    }

    const report = this.reportRepo.create({
      projectId,
      type: dto.type,
      periodStart,
      periodEnd,
      data,
      generatedBy,
    });
    return this.reportRepo.save(report);
  }

  async list(projectId: string): Promise<Report[]> {
    return this.reportRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Report> {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  private async buildReliabilitySummary(projectId: string) {
    const payments = await this.paymentsService.listByProject(projectId);
    const runs = await this.testingEngine.listRuns(projectId);
    const total = payments.length;
    const completed = payments.filter((p) => p.status === 'completed').length;
    const failed = payments.filter((p) => p.status === 'failed').length;
    const passedRuns = runs.filter((r) => r.status === 'passed').length;
    return {
      payments: { total, completed, failed },
      runs: { total: runs.length, passed: passedRuns },
      successRate: total > 0 ? completed / total : null,
    };
  }

  private async buildFailureAnalysis(projectId: string) {
    const anomalies = await this.monitoring.detectAnomalies(projectId);
    return {
      anomalies,
      byType: anomalies.reduce<Record<string, number>>((acc, a) => {
        acc[a.type] = (acc[a.type] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }

  private async buildPolicyCompliance(_projectId: string) {
    // TODO: aggregate policy evaluations across runs.
    return { note: 'Policy compliance aggregation is pending run-level violation capture' };
  }

  private async buildSettlementAudit(projectId: string) {
    const settlements = await this.settlement.listByProject(projectId);
    const confirmed = settlements.filter((s) => s.status === 'confirmed').length;
    return {
      settlements: { total: settlements.length, confirmed },
    };
  }

  private async buildDuplicateAudit(projectId: string) {
    const events = await this.monitoring.listEvents(projectId);
    const duplicates = events.filter((e) => e.type === 'duplicate_attempt');
    return { duplicateEvents: duplicates.length };
  }
}
