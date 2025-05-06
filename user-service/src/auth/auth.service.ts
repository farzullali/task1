import { Injectable, UnauthorizedException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../users/entities/user.entity';
import { TokensService, Tokens } from './tokens/tokens.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ tokens: Tokens; user: Partial<User> }> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    
    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    
    return {
      tokens,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{ tokens: Tokens; user: Partial<User> }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    console.log(user);
    
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    
    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.usersService.update(userId, { refreshToken: null });
    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOne(userId);
    
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );
    
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    
    return tokens;
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      return await this.tokensService.verifyAccessToken(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async getTokens(user: User): Promise<Tokens> {
    return this.tokensService.generateTokens(user);
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
} 