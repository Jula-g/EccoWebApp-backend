import { Category } from "src/enums/category.enum";
import { User } from "./user.entity";
import { Subcategory } from "src/enums/subcategory.enum";
import { Condition } from "src/enums/condition.enum";
import { ProductStatus } from "src/enums/status.enum";
import { TransactionType } from "src/enums/transaction.enum";

export interface Product {
    id: string;
    name: string;
    category: Category;
    subcategory: Subcategory;
    condition: Condition;
    style: string;
    description: string;
    user: User;
    price: number;
    status: ProductStatus;
    adress: {
        street: string;
        city: string;
        zip: string;
    };
    images: string[];
    createdAt: Date;
    updatedAt?: Date;
    transactionType: TransactionType;
}