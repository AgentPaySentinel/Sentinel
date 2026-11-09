import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportType } from '../enums/report-type.enum';

export class GenerateReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  periodStart?: string;

  @IsOptional()
  @IsString()
  periodEnd?: string;
}
