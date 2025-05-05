import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export declare class JwtAuthGuard implements CanActivate {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
