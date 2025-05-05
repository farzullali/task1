import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../users/entities/user.entity';
import { TokensService, Tokens } from './tokens/tokens.service';
export declare class AuthService {
    private usersService;
    private tokensService;
    constructor(usersService: UsersService, tokensService: TokensService);
    register(createUserDto: CreateUserDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    logout(userId: string): Promise<boolean>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    validateAccessToken(token: string): Promise<any>;
    private getTokens;
    private updateRefreshToken;
    private validateUser;
}
