import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permission } from '../common/permissions';
import { NotificationsService } from './notifications.service';
import type { AuthUser } from '../auth/types';

@Controller('notifications')
@ApiTags('Notifications')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @Permissions(Permission.NotificationsRead)
  @ApiOperation({ summary: 'List notifications for current user' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.notificationsService.findByUser(user);
  }

  @Patch(':id/read')
  @Permissions(Permission.NotificationsRead)
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationsService.markAsRead(id, user);
  }

  @Patch('read-all')
  @Permissions(Permission.NotificationsRead)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: AuthUser) {
    return this.notificationsService.markAllAsRead(user);
  }
}
