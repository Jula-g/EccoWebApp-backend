import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthRepository } from '../repositories/auth.repository';
import { UserRepository } from '../repositories/user.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [UserService, AuthRepository, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
