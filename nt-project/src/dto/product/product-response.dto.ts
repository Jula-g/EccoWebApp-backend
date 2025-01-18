export class ProductResponseDto {
    constructor(
      public name: string,
      public category: string,
      public subcategory: string,
      public condition: string,
      public style: string,
      public description: string, 
      public userId: string,
      public status: string,
      public price: number,
      public adress: {
        street: string;
        city: string;
        zip: string;
      },
      public images: string[] | Buffer[],
      public createdAt: Date,
      public updatedAt: Date,    
      public transactionType: string,
    ) {}
  }
  