import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { Project } from './project.entity';

export type ProjectRole = 'owner' | 'admin' | 'member';

@Entity('project_members')
export class ProjectMember extends TimestampedEntity {
  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  userId: string;

  @Column({ type: 'varchar', default: 'member' })
  role: ProjectRole;
}
