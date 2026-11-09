import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PolicyEngineService, PaymentLike } from './policy-engine.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Policy Engine')
@Controller('policies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PolicyEngineController {
  constructor(private readonly policyEngine: PolicyEngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a policy' })
  @ApiResponse({ status: 201, description: 'Policy created' })
  async createPolicy(@Body() body: { projectId: string; policy: CreatePolicyDto }) {
    return this.policyEngine.createPolicy(body.projectId, body.policy);
  }

  @Get()
  @ApiOperation({ summary: 'List policies for a project' })
  async listPolicies(@Query('projectId') projectId: string) {
    return this.policyEngine.listPolicies(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a policy' })
  async getPolicy(@Param('id', ParseUUIDPipe) id: string) {
    return this.policyEngine.getPolicy(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a policy' })
  async updatePolicy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patch: Partial<{ name: string; description: string; rules: Record<string, any>; enabled: boolean; enforce: boolean }>,
  ) {
    return this.policyEngine.updatePolicy(id, patch);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a policy' })
  async deletePolicy(@Param('id', ParseUUIDPipe) id: string) {
    await this.policyEngine.deletePolicy(id);
    return { message: 'Policy deleted' };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a planned payment against project policies' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(@Body() body: { projectId: string; payment: PaymentLike }) {
    return this.policyEngine.validatePayment(body.projectId, body.payment);
  }
}
