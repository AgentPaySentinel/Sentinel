import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Generate a report' })
  @ApiResponse({ status: 201, description: 'Report generated' })
  async generate(
    @Request() req,
    @Body() body: { projectId: string; report: GenerateReportDto },
  ) {
    return this.reports.generate(body.projectId, body.report, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List reports for a project' })
  async list(@Query('projectId') projectId: string) {
    return this.reports.list(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reports.findById(id);
  }
}
