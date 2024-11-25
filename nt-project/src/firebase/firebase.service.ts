import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  async verifyIdToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }

  async getUser(firebaseUid: string) {
    return admin.auth().getUser(firebaseUid);
  }

  async createUser(email: string, password: string, displayName?: string) {
    return admin.auth().createUser({
      email,
      password,
      displayName,
    });
  }

  async updateUser(firebaseUid: string, data: Partial<admin.auth.UpdateRequest>) {
    return admin.auth().updateUser(firebaseUid, data);
  }

  async deleteUser(firebaseUid: string) {
    return admin.auth().deleteUser(firebaseUid);
  }
}
