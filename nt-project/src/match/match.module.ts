import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchRepository } from '../repositories/match.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { ProductModule } from '../product/product.module';
import { LikeModule } from '../like/like.module';
import { JwtModule } from 'src/security/jwt.module';

@Module({
  imports: [FirebaseModule, ProductModule, LikeModule, JwtModule], 
  controllers: [MatchController],
  providers: [MatchService, MatchRepository],
  exports: [MatchService, MatchRepository]
})
export class MatchModule {}
