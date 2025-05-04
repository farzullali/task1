import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<Order>;
    findAllByUser(userId: string): Promise<Order[]>;
    findOne(id: string, userId: string): Promise<Order>;
}
