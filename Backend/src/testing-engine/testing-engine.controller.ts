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
import { TestingEngineService } from './testing-engine.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Testing Engine')
@Controller('testing-engine')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestingEngineController {
  constructor(private readonly engine: TestingEngineService) {}

  @Post('scenarios')
  @ApiOperation({ summary: 'Create a test scenario' })
  @ApiResponse({ status: 201, description: 'Scenario created' })
  async createScenario(
    @Body() body: { projectId: string; scenario: CreateScenarioDto },
  ) {
    return this.engine.createScenario(body.projectId, body.scenario);
  }

  @Get('scenarios')
  @ApiOperation({ summary: 'List test scenarios for a project' })
  async listScenarios(@Query('projectId') projectId: string) {
    return this.engine.listScenarios(projectId);
  }

  @Get('scenarios/:id')
  @ApiOperation({ summary: 'Get a test scenario' })
  async getScenario(@Param('id', ParseUUIDPipe) id: string) {
    return this.engine.getScenario(id);
  }

  @Post('scenarios/:id/runs')
  @ApiOperation({ summary: 'Run a test scenario' })
  @ApiResponse({ status: 201, description: 'Run started' })
  async runScenario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RunScenarioDto & { projectId: string },
  ) {
    return this.engine.runScenario(dto.projectId, id, dto);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get a test run' })
  async getRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.engine.getRun(id);
  }

  @Get('runs')
  @ApiOperation({ summary: 'List test runs for a project' })
  async listRuns(@Query('projectId') projectId: string) {
    return this.engine.listRuns(projectId);
  }

  @Post('runs/:id/cancel')
  @ApiOperation({ summary: 'Cancel a test run' })
  async cancelRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.engine.cancelRun(id);
  }
}
