import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_stats')
export class UserStats {
    @PrimaryColumn()
    userId: string;

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 1 })
    level: number;

    @Column('simple-array', { nullable: true })
    badges: string[];

    @Column({ default: 50 })
    safetyScore: number;

    @Column({ default: 'Newbie' })
    trustLevel: string; // Newbie, Reliable, Guardian

    @Column({ nullable: true })
    pushToken: string;
}

