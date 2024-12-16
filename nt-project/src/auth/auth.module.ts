import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/repositories/auth.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserModule } from 'src/user/user.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { JwtModule } from 'src/security/jwt.module';

@Module({
    imports: [UserModule, FirebaseModule, JwtModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, UserRepository],
    exports: [AuthService],
})
export class AuthModule {}
