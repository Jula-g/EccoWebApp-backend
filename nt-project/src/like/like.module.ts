import { Module } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [FirebaseModule, LikeRepository],
  exports: [LikeRepository], 
})
export class LikeModule {}
