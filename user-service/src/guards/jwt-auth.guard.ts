import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokensService } from '../auth/tokens/tokens.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private tokensService: TokensService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context);
      if (canActivate) {
        return true;
      }
    } catch (error) {
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.tokensService.verifyAccessToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 