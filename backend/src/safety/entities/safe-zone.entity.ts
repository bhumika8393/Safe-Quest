import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('safe_zones')
export class SafeZone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string; // Medical, Police, Embassy, Pharmacy

    @Column('decimal', { precision: 10, scale: 7 })
    lat: number;

    @Column('decimal', { precision: 10, scale: 7 })
    lon: number;

    @Column('text')
    address: string;

    @Column({ default: true })
    isOpen: boolean;

    @Column({ nullable: true })
    phone: string;
}
