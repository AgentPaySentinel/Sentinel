import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settlement } from './entities/settlement.entity';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { PaymentsModule } from '../payments/payments.module';
import { StellarAdapterModule } from '../adapters/stellar/stellar.module';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settlement]),
    PaymentsModule,
    StellarAdapterModule,
    MonitoringModule,
  ],
  providers: [SettlementService],
  controllers: [SettlementController],
  exports: [SettlementService],
})
export class SettlementModule {}
