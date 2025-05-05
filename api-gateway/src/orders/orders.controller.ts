import { Body, Controller, Get, Inject, Param, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(@Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: any, @Request() req: any) {
    try {
      return await firstValueFrom(
        this.orderClient.send('create_order', {
          userId: req.user.id,
          order: createOrderDto,
        }),
      );
    } catch (error) {
      throw new Error('Failed to create order: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    try {
      return await firstValueFrom(
        this.orderClient.send('get_user_orders', { userId: req.user.id }),
      );
    } catch (error) {
      throw new Error('Failed to fetch orders: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    try {
      return await firstValueFrom(
        this.orderClient.send('get_order', { id, userId: req.user.id }),
      );
    } catch (error) {
      throw new Error('Failed to fetch order: ' + error.message);
    }
  }
} 