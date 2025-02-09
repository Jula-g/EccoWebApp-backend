import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class LikeRepository {
    private readonly collection;

    constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
        this.collection = this.firestore.collection('likes');
    }

    async saveLike(productId: string, likedById: string, ownerId: string): Promise<void> {
        const like = { productId, likedById, ownerId };
        await this.collection.add(like);
    }

    async findLikesByUser(userId: string): Promise<any[]> {
        const snapshot = await this.collection.where('likedById', '==', userId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async findReverseLike(ownerId: string, userId: string): Promise<any | null> {
        const snapshot = await this.collection
            .where('likedById', '==', ownerId)
            .where('ownerId', '==', userId)
            .get();
        return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
}
