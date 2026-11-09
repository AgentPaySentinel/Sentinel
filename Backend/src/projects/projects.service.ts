import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Project } from './entities/project.entity';
import { ProjectMember, ProjectRole } from './entities/project-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async create(ownerId: string, dto: CreateProjectDto): Promise<Project> {
    const apiKey = `aps_${randomBytes(24).toString('hex')}`;
    const project = this.projectRepo.create({ ...dto, ownerId, apiKey });
    const saved = await this.projectRepo.save(project);

    await this.memberRepo.save(
      this.memberRepo.create({
        projectId: saved.id,
        userId: ownerId,
        role: 'owner',
      }),
    );

    return saved;
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async findByApiKey(apiKey: string): Promise<Project | null> {
    return this.projectRepo.findOne({ where: { apiKey, isActive: true } });
  }

  async listForUser(userId: string): Promise<Project[]> {
    const memberships = await this.memberRepo.find({ where: { userId } });
    if (memberships.length === 0) return [];
    return this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'member')
      .where('project.id IN (:...ids)', {
        ids: memberships.map((m) => m.projectId),
      })
      .getMany();
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findById(id);
    await this.assertCanManage(userId, project);
    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async regenerateApiKey(userId: string, id: string): Promise<Project> {
    const project = await this.findById(id);
    await this.assertCanManage(userId, project);
    project.apiKey = `aps_${randomBytes(24).toString('hex')}`;
    return this.projectRepo.save(project);
  }

  async addMember(
    requesterId: string,
    projectId: string,
    userId: string,
    role: ProjectRole = 'member',
  ): Promise<ProjectMember> {
    const project = await this.findById(projectId);
    await this.assertCanManage(requesterId, project);
    return this.memberRepo.save(
      this.memberRepo.create({ projectId, userId, role }),
    );
  }

  async listMembers(projectId: string): Promise<ProjectMember[]> {
    return this.memberRepo.find({ where: { projectId } });
  }

  async removeMember(
    requesterId: string,
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.findById(projectId);
    await this.assertCanManage(requesterId, project);
    await this.memberRepo.delete({ projectId, userId });
  }

  /**
   * Asserts the user owns or administers the project. TODO: read role from the
   * User entity once it carries a role column; for now ownership is checked via
   * project membership.
   */
  private async assertCanManage(userId: string, project: Project): Promise<void> {
    if (project.ownerId === userId) return;
    const membership = await this.memberRepo.findOne({
      where: { projectId: project.id, userId },
    });
    if (!membership || membership.role === 'member') {
      throw new ForbiddenException('Insufficient project permissions');
    }
  }
}
