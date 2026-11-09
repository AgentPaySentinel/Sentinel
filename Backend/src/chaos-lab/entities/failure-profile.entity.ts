import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { FailureType } from '../enums/failure-type.enum';

/**
 * A reusable failure-injection profile. {@link config} holds type-specific
 * parameters (e.g. delayMs for a timeout, targetStep for an interrupted
 * response). Profiles can be attached to test runs to make failures
 * reproducible.
 */
@Entity('failure_profiles')
export class FailureProfile extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  failureType: FailureType;

  /** Type-specific parameters, e.g. { delayMs: 5000, targetStep: 2 }. */
  @Column({ type: 'jsonb', default: {} })
  config: Record<string, any>;

  @Column({ default: true })
  enabled: boolean;
}
