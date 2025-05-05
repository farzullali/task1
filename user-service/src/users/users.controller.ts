import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('register_user')
  async register(@Payload() user: any) {
    return this.authService.register(user);
  }

  @MessagePattern('login_user')
  async login(@Payload() credentials: any) {
    return this.authService.login(credentials);
  }

  @MessagePattern('get_user_profile')
  async getProfile(@Payload() data: any) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern('get_user')
  async getUser(@Payload() data: any) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() data: any) {
    const { token } = data;
    return this.authService.validateAccessToken(token);
  }
} 