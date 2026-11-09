import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';

/**
 * A reusable, reproducible payment reliability scenario. {@link steps} holds
 * an ordered list of step definitions (JSON) describing the payments to make,
 * the failure profile to apply, and the policies to validate against.
 */
@Entity('test_scenarios')
export class TestScenario extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: [] })
  steps: any[];

  @Column({ default: true })
  isActive: boolean;
}
