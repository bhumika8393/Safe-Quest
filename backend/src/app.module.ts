import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SafetyModule } from './safety/safety.module';
import { ScamsModule } from './scams/scams.module';
import { RewardsModule } from './rewards/rewards.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EncryptionModule } from './encryption/encryption.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';

import { getDatabaseConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    ThrottlerModule.forRoot([{

      ttl: 60000,
      limit: 10,
    }]),
    SafetyModule,
    ScamsModule,
    RewardsModule,
    ChatModule,
    NotificationsModule,
    EncryptionModule
  ],


  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

export class AppModule { }

