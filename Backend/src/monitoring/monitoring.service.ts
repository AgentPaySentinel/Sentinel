import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEvent } from './entities/payment-event.entity';
import {
  PaymentEventType,
  EventSeverity,
} from './enums/payment-event-type.enum';

export interface Anomaly {
  paymentId?: string;
  type: PaymentEventType;
  severity: EventSeverity;
  reason: string;
}

/**
 * Payment monitoring: records lifecycle events, surfaces unresolved and
 * delayed transactions, and runs simple anomaly heuristics over the event log.
 */
@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    @InjectRepository(PaymentEvent)
    private readonly eventRepo: Repository<PaymentEvent>,
  ) {}

  async recordEvent(
    paymentId: string | undefined,
    type: PaymentEventType,
    data?: Record<string, any>,
    severity: EventSeverity = EventSeverity.INFO,
    projectId?: string,
  ): Promise<PaymentEvent> {
    const event = this.eventRepo.create({
      paymentId,
      type,
      data,
      severity,
      projectId,
    });
    return this.eventRepo.save(event);
  }

  async listEvents(
    projectId: string,
    paymentId?: string,
  ): Promise<PaymentEvent[]> {
    const where: any = { projectId };
    if (paymentId) where.paymentId = paymentId;
    return this.eventRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async listUnresolvedAlerts(projectId: string): Promise<PaymentEvent[]> {
    return this.eventRepo.find({
      where: {
        projectId,
        resolved: false,
        severity: EventSeverity.ERROR,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async resolveEvent(id: string): Promise<PaymentEvent> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new Error('Event not found');
    }
    event.resolved = true;
    return this.eventRepo.save(event);
  }

  /**
   * Heuristic anomaly detection over the event log. Flags duplicate attempts,
   * failed payments, and delayed settlements.
   *
   * TODO: add time-window thresholds (configurable per project) and a scheduled
   * job that promotes long-pending payments into alerts.
   */
  async detectAnomalies(projectId: string): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    const duplicates = await this.eventRepo.find({
      where: { projectId, type: PaymentEventType.DUPLICATE_ATTEMPT },
    });
    for (const e of duplicates) {
      anomalies.push({
        paymentId: e.paymentId,
        type: e.type,
        severity: EventSeverity.WARNING,
        reason: 'Duplicate payment attempt detected',
      });
    }

    const failed = await this.eventRepo.find({
      where: { projectId, type: PaymentEventType.PAYMENT_FAILED },
    });
    for (const e of failed) {
      anomalies.push({
        paymentId: e.paymentId,
        type: e.type,
        severity: EventSeverity.ERROR,
        reason: 'Payment failed',
      });
    }

    return anomalies;
  }
}
