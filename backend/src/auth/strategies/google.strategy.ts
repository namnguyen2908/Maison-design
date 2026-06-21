import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthProvider } from '../../users/entities/user.entity';
import { OAuthProfile } from '../types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'disabled'),
      clientSecret: configService.get<string>(
        'GOOGLE_CLIENT_SECRET',
        'disabled',
      ),
      callbackURL: configService.get<string>(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:3000/api/auth/login/google/callback',
      ),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): OAuthProfile {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('Google account does not expose an email address');
    }

    return {
      email,
      name: profile.displayName || email,
      provider: AuthProvider.Google,
      providerId: profile.id,
    };
  }
}
