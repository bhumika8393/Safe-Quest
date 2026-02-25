import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('safety_tips')
export class SafetyTip {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    content: string;

    @Column({ default: 0 })
    upvotes: number;

    @Column({ nullable: true })
    locationLabel: string; // e.g., 'Rome', 'London'

    @CreateDateColumn()
    createdAt: Date;
}
