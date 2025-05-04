import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: Partial<import("../users/entities/user.entity").User>;
    }>;
    validateToken(token: string): Promise<any>;
}
