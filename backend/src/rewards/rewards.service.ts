import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStats } from './entities/user-stats.entity';

@Injectable()
export class RewardsService {
    private readonly logger = new Logger(RewardsService.name);

    constructor(
        @InjectRepository(UserStats)
        private readonly userStatsRepository: Repository<UserStats>,
    ) { }

    async getUserStats(userId: string): Promise<UserStats> {
        let stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            stats = this.userStatsRepository.create({
                userId,
                xp: 0,
                level: 1,
                badges: [],
                safetyScore: 50,
            });
            await this.userStatsRepository.save(stats);
        }
        return stats;
    }

    async addXP(userId: string, amount: number, reason: string): Promise<UserStats> {
        const stats = await this.getUserStats(userId);
        stats.xp += amount;

        // Simple level up logic
        const newLevel = Math.floor(stats.xp / 100) + 1;
        if (newLevel > stats.level) {
            stats.level = newLevel;
            this.logger.log(`User ${userId} leveled up to ${newLevel}!`);
        }

        await this.userStatsRepository.save(stats);
        this.logger.log(`User ${userId} earned ${amount} XP for: ${reason}`);
        await this.checkTrustLevel(stats);
        return stats;
    }

    async updateSafetyScore(userId: string, change: number): Promise<UserStats> {
        const stats = await this.getUserStats(userId);
        stats.safetyScore = Math.min(Math.max(stats.safetyScore + change, 0), 100);
        await this.userStatsRepository.save(stats);
        await this.checkTrustLevel(stats);
        return stats;
    }

    private async checkTrustLevel(stats: UserStats) {
        let newLevel = 'Newbie';
        if (stats.xp > 5000 && stats.safetyScore > 80) {
            newLevel = 'Guardian';
        } else if (stats.xp > 1000 || stats.safetyScore > 60) {
            newLevel = 'Reliable';
        }

        if (newLevel !== stats.trustLevel) {
            stats.trustLevel = newLevel;
            this.logger.log(`User ${stats.userId} trust level updated to ${newLevel}`);
            await this.userStatsRepository.save(stats);
            if (newLevel === 'Guardian') {
                await this.addBadge(stats.userId, 'Elite Guardian');
            }
        }
    }

    async addBadge(userId: string, badge: string): Promise<UserStats> {
        const stats = await this.getUserStats(userId);
        if (!stats.badges) stats.badges = [];
        if (!stats.badges.includes(badge)) {
            stats.badges.push(badge);
            this.logger.log(`User ${userId} earned badge: ${badge}`);
        }
        await this.userStatsRepository.save(stats);
        return stats;
    }

    async getLeaderboard(): Promise<UserStats[]> {
        return this.userStatsRepository.find({
            order: { xp: 'DESC' },
            take: 10
        });
    }

    async getNearbyGuardians() {
        // In production, we'd use spatial indexing to find guardians near the SOS lat/lon
        // For MVP, we'll return all "Guardian" level users with a pushToken
        return this.userStatsRepository.find({
            where: { trustLevel: 'Guardian' }
        });
    }

    async updatePushToken(userId: string, token: string) {
        const stats = await this.getUserStats(userId);
        stats.pushToken = token;
        return this.userStatsRepository.save(stats);
    }
}


