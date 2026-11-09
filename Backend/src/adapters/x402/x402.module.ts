import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { X402Adapter } from './x402.adapter';

@Module({
  imports: [ConfigModule],
  providers: [X402Adapter],
  exports: [X402Adapter],
})
export class X402AdapterModule {}
