import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { PolicyEngineService } from './policy-engine.service';
import { PolicyEngineController } from './policy-engine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Policy])],
  providers: [PolicyEngineService],
  controllers: [PolicyEngineController],
  exports: [PolicyEngineService],
})
export class PolicyEngineModule {}
