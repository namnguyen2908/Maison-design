import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleName } from './entities/role.entity';

const systemRoleLabels: Record<RoleName, string> = {
  [RoleName.SuperAdmin]: 'Super Admin',
  [RoleName.Admin]: 'Admin',
  [RoleName.Designer]: 'Designer',
  [RoleName.Client]: 'Client',
};

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    await this.ensureSystemRoles();
    return this.rolesRepository.find({
      order: { isSystem: 'DESC', name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Role | null> {
    await this.ensureSystemRoles();
    return this.rolesRepository.findOne({
      where: { name: this.normalizeName(name), isActive: true },
    });
  }

  async findOrCreateSystemRole(roleName: RoleName): Promise<Role> {
    const normalizedName = this.normalizeName(roleName);
    const existingRole = await this.rolesRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingRole) {
      if (
        !existingRole.isSystem ||
        existingRole.label !== systemRoleLabels[roleName]
      ) {
        existingRole.isSystem = true;
        existingRole.label = systemRoleLabels[roleName];
        existingRole.isActive = true;
        return this.rolesRepository.save(existingRole);
      }

      return existingRole;
    }

    const role = this.rolesRepository.create({
      name: normalizedName,
      label: systemRoleLabels[roleName],
      description: null,
      isActive: true,
      isSystem: true,
    });

    return this.rolesRepository.save(role);
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const normalizedName = this.normalizeName(dto.name);
    const existingRole = await this.rolesRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = this.rolesRepository.create({
      name: normalizedName,
      label: dto.label,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
      isSystem: false,
    });

    return this.rolesRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneOrFail(id);

    if (dto.label !== undefined) {
      role.label = dto.label;
    }
    if (dto.description !== undefined) {
      role.description = dto.description;
    }
    if (dto.isActive !== undefined) {
      if (
        role.isSystem &&
        role.name === String(RoleName.SuperAdmin) &&
        !dto.isActive
      ) {
        throw new BadRequestException('SUPER_ADMIN role cannot be disabled');
      }
      role.isActive = dto.isActive;
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOneOrFail(id);

    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    await this.rolesRepository.remove(role);
  }

  private async findOneOrFail(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  private async ensureSystemRoles(): Promise<void> {
    await Promise.all(
      Object.values(RoleName).map((roleName) =>
        this.findOrCreateSystemRole(roleName),
      ),
    );
  }

  private normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, '_');
  }
}
