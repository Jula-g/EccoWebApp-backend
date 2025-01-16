import { Category } from "src/enums/category.enum";
import { Subcategory } from "src/enums/subcategory.enum";
import { TransactionType } from "src/enums/transaction.enum";

export class PatchProductDto {
    name: string;
    description: string;
    price: number;
    condition: string;
    status: string;
    transactionType: TransactionType;
    userId: string;
    category: Category;
    subcategory: Subcategory;
    images: string[];
    createdAt: Date;
  }