import { Entity, Column, Index } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { ReportType } from '../enums/report-type.enum';

/**
 * A generated report. {@link data} holds the structured, type-specific report
 * payload that the dashboard / CLI / CI integrations can render.
 */
@Entity('reports')
export class Report extends TimestampedEntity {
  @Index()
  @Column()
  projectId: string;

  @Column({ type: 'varchar' })
  type: ReportType;

  @Column({ type: 'timestamp', nullable: true })
  periodStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  periodEnd?: Date;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @Column({ nullable: true })
  generatedBy?: string;
}
