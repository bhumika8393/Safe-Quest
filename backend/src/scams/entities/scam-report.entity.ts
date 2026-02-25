import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('scam_reports')
export class ScamReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column('decimal', { precision: 10, scale: 7 })
    lat: number;

    @Column('decimal', { precision: 10, scale: 7 })
    lon: number;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    type: string;

    @Column('float', { nullable: true })
    riskScore: number;

    @Column({ default: 'Pending' })
    status: string; // Pending, Verified, Dismissed

    @Column({ nullable: true })
    evidenceUrl: string;

    @Column({ nullable: true })
    evidenceType: string; // 'image', 'video'

    @CreateDateColumn()

    createdAt: Date;
}

