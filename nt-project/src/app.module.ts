import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { FirebaseService } from './firebase/firebase.service';
import { UserService } from './user/user.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, FirebaseService, UserService, AuthService],
})
export class AppModule {}
