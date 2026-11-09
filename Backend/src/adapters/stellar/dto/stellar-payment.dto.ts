import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Parameters for submitting a Stellar payment and verifying its settlement.
 */
export class StellarPaymentDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  asset: string;

  @IsOptional()
  @IsString()
  memo?: string;
}

export interface StellarTransactionStatus {
  txHash: string;
  ledger: number;
  successful: boolean;
  confirmed: boolean;
  /** ISO timestamp the transaction was included in a ledger. */
  createdAt?: string;
}
