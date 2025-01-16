import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProductRepository } from 'src/repositories/product.repository';
import { UserModule } from 'src/user/user.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { JwtModule } from 'src/security/jwt.module';


@Module({
  imports: [AuthModule, UserModule, FirebaseModule, JwtModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, UserRepository, UserService],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
