import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Subcategory } from 'src/enums/subcategory.enum';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { ProductResponseDto } from 'src/dto/product/product-response.dto';
import sharp from 'sharp';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository,
              private readonly userRepository: UserRepository
  ) {}

  
  private async compressImage(buffer: Buffer): Promise<string> {
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();
    return compressedBuffer.toString('base64');
  }

  private async uploadImagesToFirebase(images: Express.Multer.File[]): Promise<string[]> {
    const base64Promises = images.map(async (image) => {
      const base64String = await this.compressImage(image.buffer);
      return `data:${image.mimetype};base64,${base64String}`;
    });
    return Promise.all(base64Promises);
  }

  async createProduct(firebaseUid: string, createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<ProductResponseDto> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (!user) {
        throw new NotFoundException(`User with firebaseUid ${firebaseUid} not found.`);
    }

    const base64Images = await this.uploadImagesToFirebase(images);

    const newProduct = await this.productRepository.save({
        ...createProductDto,
        images: base64Images,
        user, 
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

    let base64Images = existingProduct.images;

    if (images && images.length > 0) {
      base64Images = await this.uploadImagesToFirebase(images);
    }

    const updatedProduct = await this.productRepository.update(productId, {
      ...product,
      images: base64Images,
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

    return products.map(product => {
        const base64Images = product.images; 
        
        return new ProductResponseDto(
            product.name,
            product.category,
            product.subcategory,
            product.condition,
            product.style,
            product.description,
            product.user?.firebaseUid || null, 
            product.status,
            product.price,
            product.adress,
            base64Images,
            product.createdAt,
            product.updatedAt,
            product.transactionType
        );
    });
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
