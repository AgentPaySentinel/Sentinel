import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettlementService } from './settlement.service';
import { RecordSettlementDto } from './dto/record-settlement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Settlement')
@Controller('settlements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettlementController {
  constructor(private readonly settlement: SettlementService) {}

  @Post()
  @ApiOperation({ summary: 'Record a settlement (pending on-chain verification)' })
  @ApiResponse({ status: 201, description: 'Settlement recorded' })
  async record(@Body() body: { projectId: string; settlement: RecordSettlementDto }) {
    return this.settlement.record(body.settlement, body.projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a settlement' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.settlement.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List settlements for a project' })
  async list(@Query('projectId') projectId: string) {
    return this.settlement.listByProject(projectId);
  }

  @Get('by-payment/:paymentId')
  @ApiOperation({ summary: 'Find settlement for a payment' })
  async byPayment(@Param('paymentId') paymentId: string) {
    return this.settlement.findByPayment(paymentId);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify settlement on-chain (do not trust HTTP 200)' })
  async verify(@Param('id', ParseUUIDPipe) id: string) {
    return this.settlement.verify(id);
  }
}
