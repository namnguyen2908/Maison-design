import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { signStateToken, getAllowedOrigins } from '../state-token.util';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const hasCode = !!request.query?.code;

    if (hasCode) {
      return {};
    }

    const allowedOrigins = getAllowedOrigins(
      this.configService.get<string>('CORS_ORIGINS'),
    );

    const referer = (request.headers?.referer as string) ?? '';
    const origin = this.resolveOrigin(referer);

    if (origin && allowedOrigins.includes(origin)) {
      const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
      return { state: signStateToken(origin, secret) };
    }

    return {};
  }

  private resolveOrigin(referer: string): string | null {
    if (!referer) return null;

    try {
      const url = new URL(referer);
      const origin = url.origin.replace(/\/+$/, '');
      return origin;
    } catch {
      return null;
    }
  }
}
