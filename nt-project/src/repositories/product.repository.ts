import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Product } from '../entities/product.entity';
import { Subcategory } from 'src/enums/subcategory.enum';

@Injectable()
export class ProductRepository {
    private readonly collection;

    constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
        this.collection = this.firestore.collection('products');
    }

    async findById(productId: string): Promise<Product | null> {
        if (!productId) {
            throw new Error('Product ID is required');
          }
        
        const doc = await this.collection.doc(productId).get();
        if (!doc.exists) {
            return null;
        }
        return { firebaseUid: doc.id, ...doc.data() } as Product;
    }

    async findAll(): Promise<Product[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as Product));
    }

    async findAllBySubcategory(subcategory: Subcategory): Promise<Product[]> {
        const snapshot = await this.collection.where('subcategory', '==', subcategory).get();
        return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as Product));
    }

    async findAllByUserId(firebaseUid: string): Promise<Product[]> {
        const snapshot = await this.collection.where('user.firebaseUid', '==', firebaseUid).get();
        return snapshot.docs.map(doc => ({ firebaseUid: doc.id, ...doc.data() } as Product));
    }

    async save(product: Partial<Product>): Promise<Product> {
        if (product.images && product.images.some(img => img.length > 1048487)) {
            throw new Error('Image size exceeds Firestore limit');
        }
    
        const productWithDefaults = {
            ...product,
            createdAt: product.createdAt || new Date(),
            updatedAt: product.updatedAt || new Date(),
        };
        const docRef = await this.collection.add(productWithDefaults);
        const doc = await docRef.get();
        return { firebaseUid: doc.id, ...doc.data() } as Product;
    }
    
      
    async update(productId: string, product: Partial<Product>): Promise<Product> {
        const docRef = this.collection.doc(productId);
        await docRef.update(product);
        const updatedDoc = await docRef.get();
        return { firebaseUid: updatedDoc.id, ...updatedDoc.data() } as Product;
    }
      
    async delete(productId: string): Promise<void> {
        await this.collection.doc(productId).delete();
    }
}
