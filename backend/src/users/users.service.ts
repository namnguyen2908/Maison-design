import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { AuthProvider, User } from './entities/user.entity';

type CreateLocalUserInput = {
  email: string;
  name: string;
  passwordHash: string;
  roleName?: RoleName;
};

type UpsertOAuthUserInput = {
  email: string;
  name: string;
  provider: AuthProvider.Google | AuthProvider.Facebook;
  providerId: string;
  roleName?: RoleName;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id, isActive: true } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase(), isActive: true },
    });
  }

  findByEmailWithSecrets(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase(), isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createLocalUser(input: CreateLocalUserInput): Promise<User> {
    const role = await this.rolesService.findOrCreateSystemRole(
      input.roleName ?? RoleName.Client,
    );
    const user = this.usersRepository.create({
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: input.passwordHash,
      provider: AuthProvider.Local,
      role,
    });

    return this.usersRepository.save(user);
  }

  async upsertOAuthUser(input: UpsertOAuthUserInput): Promise<User> {
    const existingUser = await this.findByEmail(input.email);
    const role = await this.rolesService.findOrCreateSystemRole(
      input.roleName ?? RoleName.Client,
    );

    if (existingUser) {
      existingUser.name = existingUser.name || input.name;
      existingUser.provider = input.provider;
      existingUser.providerId = input.providerId;
      if (input.roleName === RoleName.SuperAdmin) {
        existingUser.role = role;
      }
      return this.usersRepository.save(existingUser);
    }

    const user = this.usersRepository.create({
      email: input.email.toLowerCase(),
      name: input.name,
      provider: input.provider,
      providerId: input.providerId,
      role,
    });

    return this.usersRepository.save(user);
  }

  async assignRole(user: User, roleName: RoleName): Promise<User> {
    if (user.role?.name === String(roleName)) {
      return user;
    }

    user.role = await this.rolesService.findOrCreateSystemRole(roleName);
    return this.usersRepository.save(user);
  }

  async assignRoleByUserId(userId: string, roleName: string): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.rolesService.findByName(roleName);

    if (!role) {
      throw new BadRequestException('Role is not active or does not exist');
    }

    user.role = role;
    return this.usersRepository.save(user);
  }
}
