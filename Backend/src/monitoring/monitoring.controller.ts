import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MonitoringController {
  constructor(private readonly monitoring: MonitoringService) {}

  @Get('events')
  @ApiOperation({ summary: 'List payment events (optionally for one payment)' })
  @ApiResponse({ status: 200, description: 'Events retrieved' })
  async listEvents(
    @Query('projectId') projectId: string,
    @Query('paymentId') paymentId?: string,
  ) {
    return this.monitoring.listEvents(projectId, paymentId);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'List unresolved alerts for a project' })
  async alerts(@Query('projectId') projectId: string) {
    return this.monitoring.listUnresolvedAlerts(projectId);
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Detect anomalies for a project' })
  async anomalies(@Query('projectId') projectId: string) {
    return this.monitoring.detectAnomalies(projectId);
  }

  @Post('events/:id/resolve')
  @ApiOperation({ summary: 'Mark an alert as resolved' })
  async resolve(@Param('id', ParseUUIDPipe) id: string) {
    return this.monitoring.resolveEvent(id);
  }
}
