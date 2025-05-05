import { ClientProxy } from '@nestjs/microservices';
export declare class AuthController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    register(registerDto: any): Promise<any>;
    login(loginDto: any): Promise<any>;
    logout(body: any): Promise<any>;
}
