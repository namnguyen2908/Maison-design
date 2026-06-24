import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import type { AuthUser, JwtPayload, OAuthProfile } from './types';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RoleName } from '../roles/entities/role.entity';
import { getAllowedOrigins, resolveRedirectUrl } from './state-token.util';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, response: Response) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.createLocalUser({
      email: dto.email,
      name: dto.name,
      passwordHash,
      roleName: this.getRoleNameForEmail(dto.email),
    });

    await this.issueAuthCookies(user, response);
    return this.toSafeUser(user);
  }

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithSecrets(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User, response: Response) {
    user = await this.ensureConfiguredRole(user);
    await this.issueAuthCookies(user, response);
    return this.toSafeUser(user);
  }

  async oauthLogin(profile: OAuthProfile, response: Response, stateToken?: string) {
    const user = await this.usersService.upsertOAuthUser({
      ...profile,
      roleName: this.getRoleNameForEmail(profile.email),
    });
    await this.issueAuthCookies(user, response);

    const allowedOrigins = getAllowedOrigins(
      this.configService.get<string>('CORS_ORIGINS'),
    );
    const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const targetUrl = resolveRedirectUrl(stateToken, allowedOrigins, secret);

    response.redirect(targetUrl);
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.issueAuthCookies(user, response);
    return this.toSafeUser(user);
  }

  logout(_user: AuthUser, response: Response): void {
    this.clearAuthCookies(response);
  }

  async getProfile(user: AuthUser) {
    const profile = await this.usersService.findById(user.id);

    if (!profile) {
      throw new UnauthorizedException();
    }

    return this.toSafeUser(profile);
  }

  private async issueAuthCookies(
    user: User,
    response: Response,
  ): Promise<TokenPair> {
    const tokens = await this.signTokenPair(user);

    this.setAuthCookies(response, tokens);

    return tokens;
  }

  private async signTokenPair(user: User): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.getAccessTokenTtlSeconds(),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.getRefreshTokenTtlSeconds(),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private setAuthCookies(response: Response, tokens: TokenPair): void {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>(
      'COOKIE_SAME_SITE',
      'lax',
    );

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: this.getAccessTokenTtlSeconds() * 1000,
    });
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      path: '/api/auth/refresh',
      maxAge: this.getRefreshTokenTtlSeconds() * 1000,
    });
  }

  private clearAuthCookies(response: Response): void {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>(
      'COOKIE_SAME_SITE',
      'lax',
    );

    response.clearCookie('accessToken', { httpOnly: true, secure, sameSite });
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure,
      sameSite,
      path: '/api/auth/refresh',
    });
  }

  private getAccessTokenTtlSeconds(): number {
    return Number(
      this.configService.getOrThrow<string>('JWT_ACCESS_TTL_SECONDS'),
    );
  }

  private getRefreshTokenTtlSeconds(): number {
    return Number(
      this.configService.getOrThrow<string>('JWT_REFRESH_TTL_SECONDS'),
    );
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      provider: user.provider,
    };
  }

  private async ensureConfiguredRole(user: User): Promise<User> {
    const configuredRoleName = this.getRoleNameForEmail(user.email);

    if (configuredRoleName === RoleName.SuperAdmin) {
      return this.usersService.assignRole(user, RoleName.SuperAdmin);
    }

    return user;
  }

  private getRoleNameForEmail(email: string): RoleName {
    const superAdminEmails = this.configService
      .get<string>('SUPER_ADMIN_EMAILS', '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    return superAdminEmails.includes(email.trim().toLowerCase())
      ? RoleName.SuperAdmin
      : RoleName.Client;
  }
}
