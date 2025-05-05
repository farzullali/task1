import { ClientProxy } from '@nestjs/microservices';
export declare class UsersController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    register(user: any): Promise<any>;
    login(credentials: any): Promise<any>;
    getProfile(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
}
