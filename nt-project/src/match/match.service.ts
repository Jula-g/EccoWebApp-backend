import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { LikeRepository } from "../repositories/like.repository";
import { MatchRepository } from "../repositories/match.repository";
import { ProductRepository } from "../repositories/product.repository";


@Injectable()
export class MatchService {
    constructor(
        private readonly matchRepository: MatchRepository,
        private readonly likeRepository: LikeRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    async likeProduct(likedById: string, productId: string): Promise<{ success: boolean; ownerId: string; reverseProductId?: string }> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found.`);
        }

        const ownerId = product.user.firebaseUid;

        if (likedById === ownerId) {
            throw new BadRequestException("You cannot like your own product.");
        }

        await this.likeRepository.saveLike(productId, likedById, ownerId);

        const reverseLike = await this.likeRepository.findReverseLike(ownerId, likedById);
        if (reverseLike) {
            const match = {
                productId1: reverseLike.productId,
                productId2: productId,
                user1Id: likedById,
                user2Id: ownerId,
            };

            await this.matchRepository.saveMatch(match);
            return {
                success: true,
                ownerId,
                reverseProductId: reverseLike.productId,
            };
        }

        return {
            success: false,
            ownerId,
            reverseProductId: null,
        };
    }
}
