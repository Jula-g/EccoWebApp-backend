import { NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Subcategory } from 'src/enums/subcategory.enum';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { ProductResponseDto } from 'src/dto/product/product-response.dto';
import * as admin from 'firebase-admin';

export class ProductService {
    constructor(
      @Inject('FIREBASE_STORAGE') private readonly storage: admin.storage.Storage,
      private readonly productRepository: ProductRepository,
    ) {}
  
    async uploadImagesToFirebase(images: Express.Multer.File[]): Promise<string[]> {
      const bucket = this.storage.bucket();
      const uploadPromises = images.map((image) => {
        const blob = bucket.file(image.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: image.mimetype,
          },
        });
  
        return new Promise<string>((resolve, reject) => {
          blobStream.on('finish', () => resolve(`https://storage.googleapis.com/${bucket.name}/${image.originalname}`));
          blobStream.on('error', (error) => reject(error));
          blobStream.end(image.buffer);
        });
      });
  
      return Promise.all(uploadPromises);
    }
  
    async createProduct(firebaseUid: string, createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<ProductResponseDto> {
      const imageUrls = await this.uploadImagesToFirebase(images);
  
      const newProduct = await this.productRepository.save({
        ...createProductDto,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      return new ProductResponseDto(
        newProduct.name,
        newProduct.category,
        newProduct.subcategory,
        newProduct.condition,
        newProduct.style,
        newProduct.description,
        newProduct.user.firebaseUid,
        newProduct.status,
        newProduct.price,
        newProduct.adress,
        newProduct.images,
        newProduct.createdAt,
        newProduct.updatedAt,
        newProduct.transactionType,
      );
    }
  
    async updateProduct(userId: string, productId: string, product: Partial<CreateProductDto>, images?: Express.Multer.File[]): Promise<ProductResponseDto> {
      const existingProduct = await this.productRepository.findById(productId);
  
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }
  
      if (existingProduct.user.firebaseUid !== userId) {
        throw new ForbiddenException(`You are not authorized to edit this product.`);
      }
  
      let imageUrls = existingProduct.images;
  
      if (images && images.length > 0) {
        imageUrls = await this.uploadImagesToFirebase(images);
      }
  
      const updatedProduct = await this.productRepository.update(productId, {
        ...product,
        images: imageUrls,
        updatedAt: new Date(),
      });
  
      return new ProductResponseDto(
        updatedProduct.name,
        updatedProduct.category,
        updatedProduct.subcategory,
        updatedProduct.condition,
        updatedProduct.style,
        updatedProduct.description,
        updatedProduct.user.firebaseUid,
        updatedProduct.status,
        updatedProduct.price,
        updatedProduct.adress,
        updatedProduct.images,
        updatedProduct.createdAt,
        updatedProduct.updatedAt,
        updatedProduct.transactionType,
      );
    }

    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findAll();
        return products.map(product =>
            new ProductResponseDto(
                product.name,
                product.category,
                product.subcategory,
                product.condition,
                product.style,
                product.description,
                product.user.firebaseUid,
                product.status,
                product.price,
                product.adress,
                product.images,
                product.createdAt,
                product.updatedAt,
                product.transactionType
            )
        );
    }
    
    async getProductsBySubcategory(subcategory: Subcategory): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findAllBySubcategory(subcategory);
        return products.map(product =>
            new ProductResponseDto(
                product.name,
                product.category,
                product.subcategory,
                product.condition,
                product.style,
                product.description,
                product.user.firebaseUid,
                product.status,
                product.price,
                product.adress,
                product.images,
                product.createdAt,
                product.updatedAt,
                product.transactionType
            )
        );
    }
    
    async getProductsByUserId(userId: string): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findAllByUserId(userId);
        return products.map(product =>
            new ProductResponseDto(
                product.name,
                product.category,
                product.subcategory,
                product.condition,
                product.style,
                product.description,
                product.user.firebaseUid,
                product.status,
                product.price,
                product.adress,
                product.images,
                product.createdAt,
                product.updatedAt,
                product.transactionType
            )
        );
    }
    

    async deleteProduct(id: string): Promise<void> {
        const existingProduct = await this.productRepository.findById(id);

        if (!existingProduct) {
            throw new NotFoundException(`Product with ID ${id} not found.`);
        }

        await this.productRepository.delete(id);
    }
}
