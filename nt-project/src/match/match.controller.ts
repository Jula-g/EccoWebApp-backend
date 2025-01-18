import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../security/jwt-auth.guard';

@Controller('api/matches')
@UseGuards(JwtAuthGuard)
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post('like/:productId')
    async likeProduct(
        @Param('productId') productId: string,
        @Body('userId') userId: string,
    ): Promise<{ isMatch: boolean }> {
        const isMatch = await this.matchService.likeProduct(userId, productId);
        return { isMatch };
    }
}
