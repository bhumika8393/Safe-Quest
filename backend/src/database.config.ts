import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
        };
    }

    // Fallback to SQLite for local development without Postgres
    return {
        type: 'sqlite',
        database: 'safequest.sqlite',
        autoLoadEntities: true,
        synchronize: true,
    };
};
