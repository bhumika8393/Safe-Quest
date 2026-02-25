import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sos_events')
export class SOSEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    encryptedLocation: string;

    @Column({ default: 'Active' })

    status: string; // Active, Resolved, Cancelled

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    resolvedAt: Date;

    @Column({ nullable: true })
    resolutionNotes: string;
}
