import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/entities/product.entity';

export class  CreateOrderDto {
    @IsNotEmpty()
    product: Product;

}