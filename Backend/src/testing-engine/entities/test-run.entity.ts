import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { TestStatus } from '../enums/test-status.enum';

/**
 * A single execution of a {@link TestScenario}. {@link result} holds the
 * structured outcome (steps passed/failed, payments recorded, failures
 * injected, policy violations) consumed by the reports module.
 */
@Entity('test_runs')
export class TestRun extends TimestampedEntity {
  @Index()
  @Column()
  scenarioId: string;

  @Index()
  @Column()
  projectId: string;

  @Column({ type: 'varchar', default: TestStatus.PENDING })
  status: TestStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  /** Run-level configuration overrides (failure profile id, adapter, etc.). */
  @Column({ type: 'jsonb', nullable: true })
  config?: Record<string, any>;

  /** Structured outcome of the run. */
  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, any>;
}
