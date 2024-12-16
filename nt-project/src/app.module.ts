import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthRepository } from './repositories/auth.repository';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './firebase/posts/posts.module';
import { JwtModule } from './security/jwt.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), JwtModule, FirebaseModule, AuthModule, UserModule, PostsModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, AuthRepository],
})
export class AppModule {}
