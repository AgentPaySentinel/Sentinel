import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestScenario } from './entities/test-scenario.entity';
import { TestRun } from './entities/test-run.entity';
import { TestingEngineService } from './testing-engine.service';
import { TestingEngineController } from './testing-engine.controller';
import { PaymentsModule } from '../payments/payments.module';
import { PolicyEngineModule } from '../policy-engine/policy-engine.module';
import { ChaosLabModule } from '../chaos-lab/chaos-lab.module';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestScenario, TestRun]),
    PaymentsModule,
    PolicyEngineModule,
    ChaosLabModule,
    MonitoringModule,
  ],
  providers: [TestingEngineService],
  controllers: [TestingEngineController],
  exports: [TestingEngineService],
})
export class TestingEngineModule {}
