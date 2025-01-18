import { ProductService } from './product.service';
import { Subcategory } from 'src/enums/subcategory.enum';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { Controller, Delete, Get, Patch, Post, Param, Body, Request, UseInterceptors, UploadedFiles, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';

@Controller('/api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(
        @Request() req: any,
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User is not authenticated.');
        }
        return await this.productService.createProduct(userId, createProductDto, images);
    }

    @Patch(':firebaseUid/:productId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async updateProduct(
      @Param('firebaseUid') firebaseUid: string,
      @Param('productId') productId: string,
      @Body() updateProductDto: Partial<CreateProductDto>,
      @UploadedFiles() images?: Express.Multer.File[],
    ) {
      return await this.productService.updateProduct(firebaseUid, productId, updateProductDto, images);
    }

    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @Get('subcategory/:subcategory')
    async getProductsBySubcategory(subcategory: Subcategory) {
        return await this.productService.getProductsBySubcategory(subcategory);
    }

    @Get('user/:userId')
    async getProductsByUserId(userId: string) {
        return await this.productService.getProductsByUserId(userId);
    }

    @Delete(':firebaseUid/:productId')
    async deleteProduct(
        @Param('firebaseUid') firebaseUid: string,
        @Param('productId') productId: string,
    ) {
        return await this.productService.deleteProduct(productId);
    }

}
