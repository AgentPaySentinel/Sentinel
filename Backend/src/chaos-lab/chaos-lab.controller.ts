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
import { ChaosLabService } from './chaos-lab.service';
import { CreateFailureProfileDto } from './dto/create-failure-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chaos Lab')
@Controller('chaos-lab')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChaosLabController {
  constructor(private readonly chaosLab: ChaosLabService) {}

  @Post('profiles')
  @ApiOperation({ summary: 'Create a failure-injection profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  async createProfile(
    @Body() body: { projectId: string; profile: CreateFailureProfileDto },
  ) {
    return this.chaosLab.createProfile(body.projectId, body.profile);
  }

  @Get('profiles')
  @ApiOperation({ summary: 'List failure-injection profiles' })
  async listProfiles(@Query('projectId') projectId: string) {
    return this.chaosLab.listProfiles(projectId);
  }

  @Get('profiles/:id')
  @ApiOperation({ summary: 'Get a failure profile' })
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.chaosLab.getProfile(id);
  }

  @Patch('profiles/:id')
  @ApiOperation({ summary: 'Update a failure profile' })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patch: Partial<{ name: string; description: string; config: Record<string, any>; enabled: boolean }>,
  ) {
    return this.chaosLab.updateProfile(id, patch);
  }

  @Delete('profiles/:id')
  @ApiOperation({ summary: 'Delete a failure profile' })
  async deleteProfile(@Param('id', ParseUUIDPipe) id: string) {
    await this.chaosLab.deleteProfile(id);
    return { message: 'Profile deleted' };
  }

  @Post('profiles/:id/inject')
  @ApiOperation({ summary: 'Resolve a failure profile for injection (descriptor)' })
  async inject(@Param('id', ParseUUIDPipe) id: string) {
    return this.chaosLab.injectFailure(id);
  }
}
