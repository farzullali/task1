import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<Order>;
    findAll(req: any): Promise<Order[]>;
    findOne(id: string, req: any): Promise<Order>;
}
