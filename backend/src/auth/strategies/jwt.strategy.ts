import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { AuthUser, JwtPayload } from '../types';

const extractAccessTokenFromCookie = (request: Request): string | null => {
  const cookies = request.cookies as { accessToken?: unknown } | undefined;
  const token = cookies?.accessToken;
  return typeof token === 'string' ? token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractAccessTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    return { ...payload, id: payload.sub };
  }
}
