import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
export interface TokenPayload {
    sub: string;
    email: string;
}
export interface Tokens {
    access_token: string;
    refresh_token: string;
}
export declare class TokensService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateTokens(user: User): Promise<Tokens>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
}
