import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class RecordPaymentDto {
  @IsString()
  @IsNotEmpty()
  intentId: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  currency: string;

  @IsString()
  @IsNotEmpty()
  network: string;

  @IsOptional()
  @IsString()
  facilitatorUrl?: string;

  @IsOptional()
  @IsString()
  payer?: string;

  @IsOptional()
  @IsString()
  payee?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsObject()
  facilitatorResponse?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tags?: Record<string, any>;
}
