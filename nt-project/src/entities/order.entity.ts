import { User } from './user.entity';
import { Product } from './product.entity';

export interface Order {
    id: number;
    user: User;
    product: Product;
    total: number;
    createdAt: Date;
}