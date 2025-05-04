import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any): Promise<Order> {
    const userId = req.user.sub;
    return this.ordersService.create(createOrderDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any): Promise<Order[]> {
    const userId = req.user.sub;
    return this.ordersService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any): Promise<Order> {
    const userId = req.user.sub;
    return this.ordersService.findOne(id, userId);
  }
} 