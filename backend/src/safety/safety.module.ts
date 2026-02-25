import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyController } from './safety.controller';
import { SafetyService } from './safety.service';
import { SOSEvent } from './entities/sos-event.entity';
import { SafeZone } from './entities/safe-zone.entity';
import { SafetyTip } from './entities/safety-tip.entity';
import { ScamReport } from '../scams/entities/scam-report.entity';
import { RewardsModule } from '../rewards/rewards.module';
import Redis from 'ioredis';

@Module({

    imports: [
        TypeOrmModule.forFeature([SOSEvent, SafeZone, SafetyTip, ScamReport]),
        RewardsModule
    ],



    controllers: [SafetyController],
    providers: [
        SafetyService,
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                if (process.env.REDIS_URL) {
                    return new Redis(process.env.REDIS_URL);
                }
                const RedisMock = require('ioredis-mock');
                console.log('Using ioredis-mock for development');
                return new RedisMock();
            },
        },

    ],
    exports: [SafetyService],
})
export class SafetyModule { }
