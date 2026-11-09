import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { SettlementStatus } from '../enums/settlement-status.enum';

/**
 * Tracks the on-chain settlement of a payment. The {@link txHash} is verified
 * against the network adapter rather than trusted from a facilitator response.
 */
@Entity('settlements')
export class Settlement extends TimestampedEntity {
  @Index()
  @Column()
  paymentId: string;

  @Index()
  @Column()
  projectId: string;

  /** Network/protocol, e.g. "stellar". */
  @Column()
  network: string;

  @Column({ type: 'varchar', default: SettlementStatus.PENDING })
  status: SettlementStatus;

  @Column({ nullable: true })
  txHash?: string;

  @Column({ type: 'int', nullable: true })
  ledger?: number;

  /** Number of confirmations observed. */
  @Column({ type: 'int', default: 0 })
  confirmations: number;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  networkResponse?: Record<string, any>;
}
