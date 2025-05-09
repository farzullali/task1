import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(data: any): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        userId: string;
        orderReference: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(data: any): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        userId: string;
        orderReference: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(data: any): Promise<{
        id: string;
        title: string;
        description: string;
        price: number;
        userId: string;
        orderReference: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
