import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      // Extract token from headers
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid token format');
      }
      
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Authentication token required');
      }
      
      // Verify the token with the user service
      try {
        const decodedToken = await firstValueFrom(
          this.userClient.send('validate_token', { token })
        );
        
        // Attach the user to the request using the actual user ID from the token
        request.user = {
          id: decodedToken.sub || decodedToken.userId,
          email: decodedToken.email,
        };
        
        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
} 