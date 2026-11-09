import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StellarAdapter } from './stellar.adapter';

@Module({
  imports: [ConfigModule],
  providers: [StellarAdapter],
  exports: [StellarAdapter],
})
export class StellarAdapterModule {}
