import { IsOptional, IsString, IsObject } from 'class-validator';

export class RunScenarioDto {
  /** Failure profile to apply (from the chaos lab). */
  @IsOptional()
  @IsString()
  failureProfileId?: string;

  /** Adapter/network to use for execution, e.g. "x402-stellar". */
  @IsOptional()
  @IsString()
  adapter?: string;

  /** Additional run-level overrides. */
  @IsOptional()
  @IsObject()
  overrides?: Record<string, any>;
}
