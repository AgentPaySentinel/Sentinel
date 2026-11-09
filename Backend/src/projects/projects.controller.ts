import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  async create(@Request() req, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects the current user belongs to' })
  @ApiResponse({ status: 200, description: 'Projects retrieved' })
  async list(@Request() req, @Query() _pagination: PaginationDto) {
    return this.projectsService.listForUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 200, description: 'Project retrieved' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(req.user.id, id, dto);
  }

  @Post(':id/api-key/rotate')
  @ApiOperation({ summary: 'Rotate the project API key' })
  @ApiResponse({ status: 200, description: 'API key rotated' })
  async rotateApiKey(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.regenerateApiKey(req.user.id, id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List project members' })
  async listMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.listMembers(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to a project' })
  async addMember(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { userId: string; role?: 'owner' | 'admin' | 'member' },
  ) {
    return this.projectsService.addMember(req.user.id, id, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from a project' })
  async removeMember(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId') userId: string,
  ) {
    await this.projectsService.removeMember(req.user.id, id, userId);
    return { message: 'Member removed' };
  }
}
