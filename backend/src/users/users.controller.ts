import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleName } from '../roles/entities/role.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleName.SuperAdmin)
  @ApiOperation({ summary: 'List all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.SuperAdmin, RoleName.Admin)
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles(RoleName.SuperAdmin)
  @ApiOperation({ summary: 'Assign role to user' })
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.usersService.assignRoleByUserId(id, dto.roleName);
  }
}
