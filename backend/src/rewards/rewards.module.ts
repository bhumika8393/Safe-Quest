import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { UserStats } from './entities/user-stats.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserStats])],
    controllers: [RewardsController],
    providers: [RewardsService],
    exports: [RewardsService],
})
export class RewardsModule { }
