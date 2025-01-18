import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateOrderDto } from 'src/dto/order/create-order.dto';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { ProductStatus } from 'src/enums/status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository, 
  ) {}

  async createOrder(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const productId  = createOrderDto.productId;  
    const orderedProduct = await this.productRepository.findById(productId);  
    
    if (!orderedProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (orderedProduct.status !== 'Available') {
      throw new BadRequestException(`Product with ID ${productId} is not available.`);
    }

    if (orderedProduct.user.firebaseUid === user.firebaseUid) {
      throw new BadRequestException(`You cannot order your own product.`);
    }

    orderedProduct.status = ProductStatus.SOLD;
    await this.productRepository.update(productId, orderedProduct);

    const totalPrice = orderedProduct.price; 

    const newOrder = await this.orderRepository.save({
      user,
      product: orderedProduct,
      total: totalPrice,
      createdAt: new Date(),
    });

    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async getAllOrdersByUserId(firebaseUid: string): Promise<Order[]> {
    return this.orderRepository.findAllByUserId(firebaseUid);
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    return order;
  }

  async updateOrder(orderId: string, updateOrderDto: Partial<CreateOrderDto>): Promise<Order> {
    const existingOrder = await this.orderRepository.findById(orderId);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (updateOrderDto.productId) {
      const product = await this.productRepository.findById(updateOrderDto.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${updateOrderDto.productId} not found.`);
      }
      existingOrder.product = product;
      existingOrder.total = product.price;
    }

    return this.orderRepository.update(orderId, existingOrder);
  }

  async deleteOrder(orderId: string): Promise<void> {
    const existingOrder = await this.orderRepository.findById(orderId);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    await this.orderRepository.delete(orderId);
  }
}
