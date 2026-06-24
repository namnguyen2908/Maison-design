import { AuthProvider } from '../users/entities/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
};

export type AuthUser = JwtPayload & {
  id: string;
};

export type OAuthProfile = {
  email: string;
  name: string;
  provider: AuthProvider.Google | AuthProvider.Facebook;
  providerId: string;
};
