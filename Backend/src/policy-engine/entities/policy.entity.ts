import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { PolicyType } from '../enums/policy-type.enum';

/**
 * A policy rule scoped to a project. {@link rules} holds type-specific
 * parameters, e.g. for a spending limit: { maxAmount, windowSeconds, currency }.
 */
@Entity('policies')
export class Policy extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  type: PolicyType;

  /** Type-specific rule parameters. */
  @Column({ type: 'jsonb', default: {} })
  rules: Record<string, any>;

  @Column({ default: true })
  enabled: boolean;

  /** When true, a violation blocks the payment (hard gate). */
  @Column({ default: true })
  enforce: boolean;
}
