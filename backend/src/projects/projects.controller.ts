import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permission } from '../common/permissions';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UploadDesignDto } from './dto/upload-design.dto';
import type { AuthUser } from '../auth/types';

@Controller()
@ApiTags('Projects')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  @Permissions(Permission.ProjectsRead)
  @ApiOperation({ summary: 'List projects (filtered by role)' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.projectsService.findAll(user);
  }

  @Post('projects')
  @Permissions(Permission.ProjectsCreate)
  @ApiOperation({ summary: 'Create a new project' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.create(dto, user);
  }

  @Get('projects/:id')
  @Permissions(Permission.ProjectsRead)
  @ApiOperation({ summary: 'Get project detail with stages and rooms' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.projectsService.findById(id, user);
  }

  @Patch('projects/:id')
  @Permissions(Permission.ProjectsUpdate)
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete('projects/:id')
  @Permissions(Permission.ProjectsDelete)
  @ApiOperation({ summary: 'Soft delete project' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.projectsService.remove(id, user);
  }

  @Post('projects/:id/stages')
  @Permissions(Permission.StagesCreate)
  @ApiOperation({ summary: 'Add stage to project' })
  addStage(
    @Param('id') id: string,
    @Body() dto: CreateStageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.addStage(id, dto, user);
  }

  @Patch('projects/:id/stages/:stageId')
  @Permissions(Permission.StagesUpdate)
  @ApiOperation({ summary: 'Update stage' })
  updateStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() dto: UpdateStageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.updateStage(id, stageId, dto, user);
  }

  @Delete('projects/:id/stages/:stageId')
  @Permissions(Permission.StagesDelete)
  @ApiOperation({ summary: 'Delete stage' })
  removeStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.removeStage(id, stageId, user);
  }

  @Post('projects/:id/stages/:stageId/rooms')
  @Permissions(Permission.RoomsCreate)
  @ApiOperation({ summary: 'Add room to stage' })
  addRoom(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() dto: CreateRoomDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.addRoom(id, stageId, dto, user);
  }

  @Patch('stages/:stageId/rooms/:roomId')
  @Permissions(Permission.RoomsUpdate)
  @ApiOperation({ summary: 'Update room' })
  updateRoom(
    @Param('stageId') stageId: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.updateRoom(stageId, roomId, dto, user);
  }

  @Delete('stages/:stageId/rooms/:roomId')
  @Permissions(Permission.RoomsDelete)
  @ApiOperation({ summary: 'Delete room' })
  removeRoom(
    @Param('stageId') stageId: string,
    @Param('roomId') roomId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.removeRoom(stageId, roomId, user);
  }

  @Patch('rooms/:roomId/approve')
  @Permissions(Permission.RoomsApprove)
  @ApiOperation({ summary: 'Client approves room' })
  approveRoom(
    @Param('roomId') roomId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.approveRoom(roomId, user);
  }

  @Post('rooms/:roomId/designs')
  @Permissions(Permission.DesignsUpload)
  @ApiOperation({ summary: 'Upload design version' })
  uploadDesign(
    @Param('roomId') roomId: string,
    @Body() dto: UploadDesignDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.uploadDesign(roomId, dto, {
      url: '',
      publicId: '',
      originalName: '',
      width: 0,
      height: 0,
    }, user);
  }

  @Get('rooms/:roomId/designs')
  @Permissions(Permission.DesignsRead)
  @ApiOperation({ summary: 'List design versions for a room' })
  getDesignVersions(
    @Param('roomId') roomId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.getDesignVersions(roomId, user);
  }

  @Get('designs/:designId')
  @Permissions(Permission.DesignsRead)
  @ApiOperation({ summary: 'Get design version detail with images' })
  getDesignVersion(
    @Param('designId') designId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projectsService.getDesignVersion(designId, user);
  }
}
