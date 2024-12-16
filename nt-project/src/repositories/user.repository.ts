import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly collection;

  constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
    this.collection = this.firestore.collection('users');
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as User));
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const doc = await this.collection.doc(firebaseUid).get();
    if (!doc.exists) return null;
    return { firebaseUid: doc.id, ...doc.data() } as User;
  }

  async update(firebaseUid: string, user: Partial<User>): Promise<User> {
    const docRef = this.collection.doc(firebaseUid);
    await docRef.update(user);
    const updatedDoc = await docRef.get();
    return { firebaseUid: updatedDoc.id, ...updatedDoc.data() } as User;
  }

  async save(user: Omit<User, 'firebaseUid'>): Promise<User> {
    const docRef = await this.collection.add(user);
    const doc = await docRef.get();
    return { firebaseUid: doc.id, ...doc.data() } as User;
  }
}
