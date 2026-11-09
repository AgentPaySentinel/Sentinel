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
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a payment (simulated or observed)' })
  @ApiResponse({ status: 201, description: 'Payment recorded with duplicate detection' })
  async record(@Body() dto: RecordPaymentDto & { projectId: string }) {
    return this.paymentsService.record(dto.projectId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by id' })
  @ApiResponse({ status: 200, description: 'Payment retrieved' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List payments for a project' })
  @ApiResponse({ status: 200, description: 'Payments retrieved' })
  async list(
    @Query('projectId') projectId: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentsService.listByProject(projectId, status);
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'List attempts for a payment (duplicate analysis)' })
  async listAttempts(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.listAttempts(id);
  }

  @Get('unresolved/:projectId')
  @ApiOperation({ summary: 'List unresolved payments for a project' })
  async unresolved(@Param('projectId') projectId: string) {
    return this.paymentsService.findUnresolved(projectId);
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Update a payment status' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: PaymentStatus; settledAt?: string },
  ) {
    return this.paymentsService.updateStatus(
      id,
      body.status,
      body.settledAt ? new Date(body.settledAt) : undefined,
    );
  }
}
