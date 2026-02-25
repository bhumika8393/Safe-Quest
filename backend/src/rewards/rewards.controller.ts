import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) { }

    @Get('stats/:userId')
    async getStats(@Param('userId') userId: string) {
        return this.rewardsService.getUserStats(userId);
    }

    @Patch('stats/:userId/token')
    async updateToken(@Param('userId') userId: string, @Body() data: { pushToken: string }) {
        return this.rewardsService.updatePushToken(userId, data.pushToken);
    }

    @Get('leaderboard')
    async getLeaderboard() {
        return this.rewardsService.getLeaderboard();
    }
}


