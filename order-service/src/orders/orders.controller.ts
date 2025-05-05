import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  async create(@Payload() data: any) {
    const { userId, order } = data;
    return this.ordersService.create(order, userId);
  }

  @MessagePattern('get_user_orders')
  async findAll(@Payload() data: any) {
    const { userId } = data;
    return this.ordersService.findAllByUser(userId);
  }

  @MessagePattern('get_order')
  async findOne(@Payload() data: any) {
    const { id, userId } = data;
    return this.ordersService.findOne(id, userId);
  }
} 