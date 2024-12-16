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
      databaseURL: "https://nt-project-6013f-default-rtdb.europe-west1.firebasedatabase.app"
    });
  }
};

const firestoreProvider = {
  provide: 'FIRESTORE',
  useFactory: (firebaseApp: admin.app.App) => firebaseApp.firestore(),
  inject: ['FIREBASE_APP'],
};


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '../../process.env',
    isGlobal: true,
  })],
  providers: [firebaseProvider, FirebaseRepository, firestoreProvider],
  exports: [FirebaseRepository, firestoreProvider],
})
export class FirebaseModule {}