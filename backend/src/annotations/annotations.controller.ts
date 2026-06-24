import {
  Body,
  Controller,
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
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateAnnotationStatusDto } from './dto/update-annotation-status.dto';
import type { AuthUser } from '../auth/types';

@Controller()
@ApiTags('Annotations')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Get('designs/:designId/annotations')
  @Permissions(Permission.AnnotationsRead)
  @ApiOperation({ summary: 'Get all annotations for a design version' })
  findByDesign(@Param('designId') designId: string) {
    return this.annotationsService.findByDesignVersion(designId);
  }

  @Post('designs/:designId/annotations')
  @Permissions(Permission.AnnotationsCreate)
  @ApiOperation({ summary: 'Create a new annotation on a design' })
  create(
    @Param('designId') designId: string,
    @Body() dto: CreateAnnotationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.annotationsService.create(designId, dto, user);
  }

  @Patch('annotations/:id/status')
  @Permissions(Permission.AnnotationsResolve)
  @ApiOperation({ summary: 'Resolve or reopen annotation' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAnnotationStatusDto,
  ) {
    return this.annotationsService.updateStatus(id, dto);
  }

  @Post('annotations/:id/comments')
  @Permissions(Permission.AnnotationsComment)
  @ApiOperation({ summary: 'Add comment to annotation' })
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.annotationsService.addComment(id, dto, user);
  }
}
