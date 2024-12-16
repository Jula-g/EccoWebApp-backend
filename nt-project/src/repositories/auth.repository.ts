import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class AuthRepository {
  private readonly collection;

  constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
    this.collection = this.firestore.collection('auth');
  }

  async findByUsername(username: string): Promise<any | null> {
    const snapshot = await this.collection.where('username', '==', username).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  async save(auth: any): Promise<any> {
    const docRef = await this.collection.add(auth);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async deleteByUserId(userId: string): Promise<void> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    if (!snapshot.empty) {
      const batch = this.firestore.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }
  }
}
