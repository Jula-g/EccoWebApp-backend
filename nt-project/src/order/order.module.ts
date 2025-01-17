import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from 'src/repositories/order.repository';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { JwtModule } from 'src/security/jwt.module';

@Module({
  imports: [ProductModule, UserModule, FirebaseModule, JwtModule], 
  controllers: [OrderController], 
  providers: [OrderService, OrderRepository], 
  exports: [OrderService, OrderRepository], 
})
export class OrderModule {}
