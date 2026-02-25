import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScamsController } from './scams.controller';
import { ScamsService } from './scams.service';
import { RewardsModule } from '../rewards/rewards.module';
import { ScamReport } from './entities/scam-report.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ScamReport]),
        RewardsModule
    ],
    controllers: [ScamsController],
    providers: [ScamsService],
})
export class ScamsModule { }
