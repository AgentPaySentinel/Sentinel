import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settlement } from './entities/settlement.entity';
import { SettlementStatus } from './enums/settlement-status.enum';
import { RecordSettlementDto } from './dto/record-settlement.dto';
import { PaymentsService } from '../payments/payments.service';
import { StellarAdapter } from '../adapters/stellar/stellar.adapter';
import { MonitoringService } from '../monitoring/monitoring.service';

/**
 * Settlement tracking. Records settlement intent, then verifies it on-chain via
 * the network adapter — never trusting a successful HTTP response alone. On
 * confirmation, the parent payment status is updated and a monitoring event is
 * emitted; delays and failures are surfaced as alerts.
 */
@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepo: Repository<Settlement>,
    private readonly paymentsService: PaymentsService,
    private readonly stellarAdapter: StellarAdapter,
    private readonly monitoring: MonitoringService,
  ) {}

  async record(dto: RecordSettlementDto, projectId: string): Promise<Settlement> {
    const settlement = this.settlementRepo.create({
      ...dto,
      projectId,
      status: dto.status ?? SettlementStatus.PENDING,
    });
    const saved = await this.settlementRepo.save(settlement);

    await this.monitoring.recordEvent(
      dto.paymentId,
      'settlement_pending' as any,
      { txHash: dto.txHash, network: dto.network },
      undefined,
      projectId,
    );

    return saved;
  }

  async findById(id: string): Promise<Settlement> {
    const settlement = await this.settlementRepo.findOne({ where: { id } });
    if (!settlement) {
      throw new NotFoundException('Settlement not found');
    }
    return settlement;
  }

  async findByPayment(paymentId: string): Promise<Settlement | null> {
    return this.settlementRepo.findOne({ where: { paymentId } });
  }

  async listByProject(projectId: string): Promise<Settlement[]> {
    return this.settlementRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  /**
   * Verifies a settlement on-chain. For Stellar, reads the transaction status
   * directly from the network and updates the settlement + parent payment.
   *
   * This implements the README principle: avoid treating a successful HTTP
   * response as proof of successful blockchain settlement.
   */
  async verify(id: string): Promise<Settlement> {
    const settlement = await this.findById(id);
    if (!settlement.txHash) {
      throw new Error('Settlement has no transaction hash to verify');
    }

    let confirmed = false;
    let ledger: number | undefined;
    let networkResponse: Record<string, any> | undefined;

    if (settlement.network === 'stellar' || settlement.network === 'x402-stellar') {
      const status = await this.stellarAdapter.getTransactionStatus(settlement.txHash);
      confirmed = status.confirmed && status.successful;
      ledger = status.ledger;
      networkResponse = { ...status };
    } else {
      // TODO: dispatch to the correct network adapter.
      this.logger.warn(`No adapter for network ${settlement.network}`);
    }

    if (confirmed) {
      settlement.status = SettlementStatus.CONFIRMED;
      settlement.confirmations += 1;
      settlement.ledger = ledger ?? settlement.ledger;
      settlement.confirmedAt = new Date();
      settlement.networkResponse = networkResponse;
      await this.paymentsService.updateStatus(
        settlement.paymentId,
        'completed' as any,
        settlement.confirmedAt,
      );
      await this.monitoring.recordEvent(
        settlement.paymentId,
        'settlement_confirmed' as any,
        { txHash: settlement.txHash, ledger },
        undefined,
        settlement.projectId,
      );
    } else {
      settlement.status = SettlementStatus.PENDING;
      settlement.networkResponse = networkResponse;
      await this.monitoring.recordEvent(
        settlement.paymentId,
        'settlement_delayed' as any,
        { txHash: settlement.txHash },
        undefined,
        settlement.projectId,
      );
    }

    return this.settlementRepo.save(settlement);
  }
}
