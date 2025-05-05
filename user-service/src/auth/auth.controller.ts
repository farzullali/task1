import { Controller, Post, Body, Get, UseGuards, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Tokens } from './tokens/tokens.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<{ tokens: Tokens; user: Partial<User> }> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ tokens: Tokens; user: Partial<User> }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req): Promise<{ success: boolean }> {
    const success = await this.authService.logout(req.user.sub);
    return { success };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto): Promise<Tokens> {
    return this.authService.refreshTokens(
      refreshTokenDto.userId, 
      refreshTokenDto.refreshToken
    );
  }

  @Get('validate/:token')
  async validateToken(@Param('token') token: string) {
    return this.authService.validateAccessToken(token);
  }
} 