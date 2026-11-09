import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SettlementStatus } from '../enums/settlement-status.enum';

export class RecordSettlementDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  network: string;

  @IsOptional()
  @IsString()
  txHash?: string;

  @IsOptional()
  @IsEnum(SettlementStatus)
  status?: SettlementStatus;
}
