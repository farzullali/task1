import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(data: any): Promise<{
        title: string;
        description: string;
        price: number;
        orderReference: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(data: any): Promise<{
        title: string;
        description: string;
        price: number;
        orderReference: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(data: any): Promise<{
        title: string;
        description: string;
        price: number;
        orderReference: string | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
