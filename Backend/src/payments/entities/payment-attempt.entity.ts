import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

/**
 * A single attempt to make a payment. Multiple attempts sharing the same
 * {@link intentId} (on the parent {@link Payment}) indicate a possible
 * duplicate-payment scenario and are the basis for idempotency testing.
 */
@Entity('payment_attempts')
export class PaymentAttempt extends TimestampedEntity {
  @Index()
  @Column()
  paymentId: string;

  @Index()
  @Column()
  intentId: string;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  /** Whether this attempt was classified as a duplicate of a prior attempt. */
  @Column({ default: false })
  isDuplicate: boolean;

  @Column({ type: 'int', default: 0 })
  attemptNumber: number;

  @Column({ type: 'jsonb', nullable: true })
  request?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  response?: Record<string, any>;

  @Column({ type: 'int', nullable: true })
  responseStatus?: number;

  @Column({ type: 'int', nullable: true })
  durationMs?: number;

  @Column({ type: 'text', nullable: true })
  error?: string;
}
