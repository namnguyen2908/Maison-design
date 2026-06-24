import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser, OAuthProfile } from './types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import type { User } from '../users/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Register with email and password' })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  login(
    @Body() _dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user as User, res);
  }

  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Rotate refresh token and issue new cookies' })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    return this.authService.refresh(refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiCookieAuth('accessToken')
  @ApiOperation({ summary: 'Logout current user and clear auth cookies' })
  logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('accessToken')
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user);
  }

  @UseGuards(GoogleAuthGuard)
  @Get(['google', 'login/google'])
  @ApiOperation({ summary: 'Start Google OAuth login' })
  googleAuth() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get(['google/callback', 'login/google/callback'])
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const stateToken = req.query?.state as string | undefined;
    return this.authService.oauthLogin(req.user as OAuthProfile, res, stateToken);
  }

  @UseGuards(FacebookAuthGuard)
  @Get(['facebook', 'login/facebook'])
  @ApiOperation({ summary: 'Start Facebook OAuth login' })
  facebookAuth() {
    return;
  }

  @UseGuards(FacebookAuthGuard)
  @Get(['facebook/callback', 'login/facebook/callback'])
  @ApiOperation({ summary: 'Handle Facebook OAuth callback' })
  facebookCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const stateToken = req.query?.state as string | undefined;
    return this.authService.oauthLogin(req.user as OAuthProfile, res, stateToken);
  }
}
