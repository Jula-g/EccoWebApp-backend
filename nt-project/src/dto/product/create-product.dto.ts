import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Condition } from '../../enums/condition.enum';
import { ProductStatus } from '../../enums/status.enum';
import { TransactionType } from '../../enums/transaction.enum';
import { Optional } from '@nestjs/common';
import { Category } from '../../enums/category.enum';
import { Subcategory } from '../../enums/subcategory.enum';


export class  CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsEnum(Condition)
    @IsNotEmpty()
    condition: Condition;

    @IsString()
    @IsNotEmpty()
    category: Category;
        
    @IsEnum(Subcategory)
    @IsNotEmpty()
    subcategory: Subcategory;

    @IsEnum(ProductStatus)
    @IsNotEmpty()
    status: ProductStatus;

    @Optional()
    style: string;

    @IsEnum(TransactionType)
    @IsNotEmpty()
    transactionType: TransactionType;

    @IsNotEmpty()
    adress: {
        street: string;
        city: string;
        zip: string;
    };

    @IsNotEmpty()
    images: string[];
}