import { ClientProxy } from '@nestjs/microservices';
export declare class OrdersController {
    private readonly orderClient;
    constructor(orderClient: ClientProxy);
    create(createOrderDto: any, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
}
