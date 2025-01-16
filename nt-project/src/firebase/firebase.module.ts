import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.repository';


const firebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    const serviceAccount = require("../../service-account.json");

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://nt-project-6013f-default-rtdb.europe-west1.firebasedatabase.app",
      storageBucket: "nt-project-6013f.appspot.com",
    });
  }
};

const firestoreProvider = {
  provide: 'FIRESTORE',
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.firestore(),
  inject: ['FIREBASE_APP'],
};

const storageProvider = {
  provide: 'FIREBASE_STORAGE',
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.storage().bucket(),
  inject: ['FIREBASE_APP'],
};


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../process.env',
      isGlobal: true,
    }),
  ],
  providers: [firebaseProvider, firestoreProvider, FirebaseRepository, storageProvider],
  exports: [FirebaseRepository, firestoreProvider, storageProvider],
})
export class FirebaseModule {}
