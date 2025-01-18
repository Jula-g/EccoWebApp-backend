import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Order } from 'src/entities/order.entity';


@Injectable()
export class OrderRepository {
    private readonly collection;

    constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
        this.collection = this.firestore.collection('orders');
    }

    async findById(orderId: string): Promise<Order | null> {
        const doc = await this.collection.doc(orderId).get();
        if (!doc.exists) {
            return null;
        } 
        return { firebaseUid: doc.id, ...doc.data() } as Order;
    }

    async findAll(): Promise<Order[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as Order));
    }

    async findAllByUserId(firebaseUid: string): Promise<Order[]> {
        const snapshot = await this.collection.where('user.firebaseUid', '==', firebaseUid).get();
        return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as Order));
    }

    async save(order: Partial<Order>): Promise<Order> {
        const orderWithDefaults = {
            ...order,
            createdAt: order.createdAt || new Date(),
        };
        const docRef = await this.collection.add(orderWithDefaults);
        const doc = await docRef.get();
        return { firebaseUid: doc.id, ...doc.data() } as Order;
    }

    async update(orderId: string, order: Partial<Order>): Promise<Order> {
        const docRef = this.collection.doc(orderId);
        await docRef.update(order);
        const updatedDoc = await docRef.get();
        return { firebaseUid: updatedDoc.id, ...updatedDoc.data() } as Order;
    }

    async delete(orderId: string): Promise<void> {
        await this.collection.doc(orderId).delete();
    }
}