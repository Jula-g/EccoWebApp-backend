import { Controller, Get, Post, Body, Param, Patch, Request, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from 'src/dto/order/create-order.dto';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';

  @Controller('/api/orders')
  @UseGuards(JwtAuthGuard)
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(
      @Request() req: any,
      @Body() createOrderDto: CreateOrderDto,
    ): Promise<Order> {
      const user = req.user;
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
  