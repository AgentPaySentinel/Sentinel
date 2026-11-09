import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PaymentsModule } from '../payments/payments.module';
import { TestingEngineModule } from '../testing-engine/testing-engine.module';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    PaymentsModule,
    TestingEngineModule,
    MonitoringModule,
    SettlementModule,
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
