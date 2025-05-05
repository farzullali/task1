import { Body, Controller, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    try {
      const result = await firstValueFrom(this.userClient.send('register_user', registerDto));
      
      // Ensure we're getting the expected response with tokens
      if (!result || !result.tokens) {
        throw new Error('Invalid response from auth service');
      }
      
      return result;
    } catch (error) {
      console.error('Registration error in API Gateway:', error);
      
      // Extract more detailed error information
      let message = 'Registration failed';
      let statusCode = HttpStatus.BAD_REQUEST;
      
      if (error.message) {
        message = error.message;
        
        // Check if this is a duplicate email error
        if (error.message.includes('Email already exists')) {
          message = 'Email already exists';
        }
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: message,
        },
        statusCode,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    try {
      const result = await firstValueFrom(this.userClient.send('login_user', loginDto));
      
      // Ensure we're getting the expected response with tokens
      if (!result || !result.tokens) {
        throw new Error('Invalid response from auth service');
      }
      
      return result;
    } catch (error) {
      console.error('Login error in API Gateway:', error);
      
      // Extract more detailed error information
      let message = 'Login failed';
      let statusCode = HttpStatus.UNAUTHORIZED;
      
      if (error.message) {
        message = error.message;
        
        // Check if this is an unauthorized exception from the user service
        if (error.message.includes('Invalid credentials')) {
          message = 'Invalid email or password';
        }
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: message,
        },
        statusCode,
      );
    }
  }

  @Post('logout')
  async logout(@Body() body: any) {
    try {
      if (body.refreshToken) {
        return await firstValueFrom(this.userClient.send('logout_user', { refreshToken: body.refreshToken }));
      }
      return { success: true };
    } catch (error) {
      return { success: true }; // Always return success for logout
    }
  }
} 