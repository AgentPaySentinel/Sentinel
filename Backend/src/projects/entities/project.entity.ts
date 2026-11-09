import { Entity, Column, OneToMany } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { ProjectMember } from './project-member.entity';

/**
 * A project is the top-level scoping unit: test scenarios, payments, policies,
 * and reports all belong to a project so that teams can isolate their test data.
 */
@Entity('projects')
export class Project extends TimestampedEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  ownerId: string;

  /** Project-scoped API key used by the testing engine / SDK / CI integrations. */
  @Column({ unique: true })
  apiKey: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}
