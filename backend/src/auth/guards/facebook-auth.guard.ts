import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (!this.configService.get<string>('FACEBOOK_APP_ID')) {
      throw new ServiceUnavailableException('Facebook auth is not configured');
    }

    return super.canActivate(context);
  }
}
