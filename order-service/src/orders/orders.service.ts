import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException(`Order with ID ${id} not found or not accessible`);
    }

    return order;
  }
} 