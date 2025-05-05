import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    register(user: any): Promise<{
        tokens: import("../auth/tokens/tokens.service").Tokens;
        user: Partial<import("./entities/user.entity").User>;
    }>;
    login(credentials: any): Promise<{
        tokens: import("../auth/tokens/tokens.service").Tokens;
        user: Partial<import("./entities/user.entity").User>;
    }>;
    getProfile(data: any): Promise<import("./entities/user.entity").User>;
    getUser(data: any): Promise<import("./entities/user.entity").User>;
    validateToken(data: any): Promise<any>;
}
