import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthProvider } from '../../users/entities/user.entity';
import { OAuthProfile } from '../types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID', 'disabled'),
      clientSecret: configService.get<string>(
        'FACEBOOK_APP_SECRET',
        'disabled',
      ),
      callbackURL: configService.get<string>(
        'FACEBOOK_CALLBACK_URL',
        'http://localhost:3000/api/auth/login/facebook/callback',
      ),
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthProfile {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('Facebook account does not expose an email address');
    }

    return {
      email,
      name: profile.displayName || email,
      provider: AuthProvider.Facebook,
      providerId: profile.id,
    };
  }
}
