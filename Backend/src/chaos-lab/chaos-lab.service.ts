import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FailureProfile } from './entities/failure-profile.entity';
import { FailureType } from './enums/failure-type.enum';
import { CreateFailureProfileDto } from './dto/create-failure-profile.dto';

export interface InjectedFailure {
  profileId: string;
  failureType: FailureType;
  config: Record<string, any>;
  applied: boolean;
}

/**
 * The chaos lab's failure injector. It manages failure profiles and, when a
 * profile is applied to a run, returns a descriptor describing the failure that
 * the testing engine should simulate.
 *
 * TODO: integrate with the network adapters so failures are applied at the
 * transport layer (e.g. an x402 adapter middleware that honours a profile).
 */
@Injectable()
export class ChaosLabService {
  private readonly logger = new Logger(ChaosLabService.name);

  constructor(
    @InjectRepository(FailureProfile)
    private readonly profileRepo: Repository<FailureProfile>,
  ) {}

  async createProfile(
    projectId: string,
    dto: CreateFailureProfileDto,
  ): Promise<FailureProfile> {
    const profile = this.profileRepo.create({ ...dto, projectId });
    return this.profileRepo.save(profile);
  }

  async listProfiles(projectId: string): Promise<FailureProfile[]> {
    return this.profileRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async getProfile(id: string): Promise<FailureProfile> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Failure profile not found');
    }
    return profile;
  }

  async updateProfile(
    id: string,
    patch: Partial<Pick<FailureProfile, 'name' | 'description' | 'config' | 'enabled'>>,
  ): Promise<FailureProfile> {
    const profile = await this.getProfile(id);
    Object.assign(profile, patch);
    return this.profileRepo.save(profile);
  }

  async deleteProfile(id: string): Promise<void> {
    await this.profileRepo.delete(id);
  }

  /**
   * Resolves a profile and returns the failure descriptor to apply during a run.
   */
  async injectFailure(profileId: string): Promise<InjectedFailure> {
    const profile = await this.getProfile(profileId);
    if (!profile.enabled) {
      this.logger.warn(`Failure profile ${profileId} is disabled; no failure injected`);
      return {
        profileId,
        failureType: profile.failureType,
        config: profile.config,
        applied: false,
      };
    }

    this.logger.log(
      `Injecting failure ${profile.failureType} (profile ${profileId})`,
    );
    return {
      profileId,
      failureType: profile.failureType,
      config: profile.config,
      applied: true,
    };
  }
}
