import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderDto } from 'src/dto/order/create-order.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

  @Controller('/api/order')
  @UseGuards(JwtAuthGuard)
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(
      @CurrentUser() user: User,
      @Body() createOrderDto: CreateOrderDto,
    ): Promise<Order> {
      return this.orderService.createOrder(user, createOrderDto);
    }
  
    @Get()
    async getOrders(): Promise<Order[]> {
      return this.orderService.getOrders();
    }
  
    @Get(':id')
    async getOrder(@Param('id') orderId: string): Promise<Order> {
      return this.orderService.getOrder(orderId);
    }
  
    @Get('user/:userId')
    async getAllOrdersByUserId(@Param('userId') userId: string): Promise<Order[]> {
      return this.orderService.getAllOrdersByUserId(userId);
    }
  
    @Patch(':id')
    async updateOrder(
      @Param('id') orderId: string,
      @Body() updateOrderDto: Partial<CreateOrderDto>,
    ): Promise<Order> {
      return this.orderService.updateOrder(orderId, updateOrderDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteOrder(@Param('id') orderId: string): Promise<void> {
      await this.orderService.deleteOrder(orderId);
    }
  }
  