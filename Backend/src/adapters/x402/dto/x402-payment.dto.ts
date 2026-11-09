import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

/**
 * Parameters for creating an x402 payment request. x402 uses HTTP 402
 * (Payment Required) responses to negotiate payment for a resource.
 */
export class X402PaymentRequestDto {
  @IsString()
  @IsNotEmpty()
  resourceUrl: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export interface X402PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  asset: string;
  payee: string;
  resource: string;
  /** Facilitator endpoint that brokers the payment. */
  facilitator: string;
}

export interface X402PaymentResult {
  paymentHeader: string;
  requirements: X402PaymentRequirements;
  verified: boolean;
}
