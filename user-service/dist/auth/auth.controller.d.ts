import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Tokens } from './tokens/tokens.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<Tokens>;
    validateToken(token: string): Promise<any>;
}
