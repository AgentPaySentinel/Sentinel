import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

/**
 * A single payment record (simulated or observed). The {@link intentId} is the
 * idempotency key used to detect duplicate payment attempts.
 */
@Entity('payments')
export class Payment extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  /** Idempotency / intent key shared across retries of the same payment. */
  @Index()
  @Column()
  intentId: string;

  @Column({ type: 'decimal', precision: 30, scale: 18 })
  amount: string;

  @Column({ default: 'USDC' })
  currency: string;

  /** Network/protocol used, e.g. "x402-stellar". */
  @Column()
  network: string;

  /** Facilitator endpoint that handled the payment. */
  @Column({ nullable: true })
  facilitatorUrl?: string;

  /** Wallet/address paying the payment. */
  @Column({ nullable: true })
  payer?: string;

  /** Wallet/address receiving the payment. */
  @Column({ nullable: true })
  payee?: string;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  /** Raw facilitator response for later analysis. */
  @Column({ type: 'jsonb', nullable: true })
  facilitatorResponse?: Record<string, any>;

  /** Timestamp the payment was considered complete by the facilitator. */
  @Column({ type: 'timestamp', nullable: true })
  settledAt?: Date;

  /** Free-form labels for filtering (test scenario id, run id, etc.). */
  @Column({ type: 'jsonb', nullable: true })
  tags?: Record<string, any>;
}
