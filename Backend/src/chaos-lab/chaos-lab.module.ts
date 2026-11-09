import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FailureProfile } from './entities/failure-profile.entity';
import { ChaosLabService } from './chaos-lab.service';
import { ChaosLabController } from './chaos-lab.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FailureProfile])],
  providers: [ChaosLabService],
  controllers: [ChaosLabController],
  exports: [ChaosLabService],
})
export class ChaosLabModule {}
