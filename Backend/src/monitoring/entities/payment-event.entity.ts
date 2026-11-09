import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { PaymentEventType, EventSeverity } from '../enums/payment-event-type.enum';

/**
 * An immutable payment lifecycle event. The monitoring module appends these as
 * payments, tests, and settlements progress, then derives alerts and unresolved
 * transactions from the resulting event log.
 */
@Entity('payment_events')
export class PaymentEvent extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  @Index()
  @Column({ nullable: true })
  paymentId?: string;

  @Column({ type: 'varchar' })
  type: PaymentEventType;

  @Column({ type: 'varchar', default: EventSeverity.INFO })
  severity: EventSeverity;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  /** Whether the event has been acknowledged/resolved by an operator. */
  @Column({ default: false })
  resolved: boolean;
}
