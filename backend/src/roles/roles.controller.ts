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
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleName } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Roles')
@ApiCookieAuth('accessToken')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SuperAdmin)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create role' })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete non-system role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
