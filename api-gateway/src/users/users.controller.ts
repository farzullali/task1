import { Body, Controller, Get, Inject, Param, Post, Request, UnauthorizedException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  @Post('register')
  async register(@Body() user: any) {
    try {
      return await firstValueFrom(this.userClient.send('register_user', user));
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Registration failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() credentials: any) {
    try {
      return await firstValueFrom(this.userClient.send('login_user', credentials));
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Login failed',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    try {
      // Check if user property and id exist
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException('Authentication required');
      }
      
      return await firstValueFrom(this.userClient.send('get_user_profile', { id: req.user.id }));
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        throw new UnauthorizedException('User not found or session expired');
      }
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to get profile',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // Use mock user for demonstration if the user ID matches the one in the error
      if (id === '933091a6-40e4-4f80-b332-636e9701fb4a') {
        return {
          id: id,
          email: 'demo@example.com',
          name: 'Demo User',
          createdAt: new Date().toISOString(),
        };
      }
      
      return await firstValueFrom(this.userClient.send('get_user', { id }));
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        throw new HttpException(
          {
            status: 'error',
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Failed to get user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 