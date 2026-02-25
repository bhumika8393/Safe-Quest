import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { SOSEvent } from './entities/sos-event.entity';
import { SafeZone } from './entities/safe-zone.entity';
import { SafetyTip } from './entities/safety-tip.entity';
import { ScamReport } from '../scams/entities/scam-report.entity';
import { RewardsService } from '../rewards/rewards.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Between } from 'typeorm';





@Injectable()
export class SafetyService {
    private readonly logger = new Logger(SafetyService.name);

    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        @InjectRepository(SOSEvent)
        private sosEventRepository: Repository<SOSEvent>,
        @InjectRepository(SafeZone)
        private safeZoneRepository: Repository<SafeZone>,
        @InjectRepository(ScamReport)
        private scamReportRepository: Repository<ScamReport>,
        @InjectRepository(SafetyTip)
        private safetyTipRepository: Repository<SafetyTip>,
        private rewardsService: RewardsService,
        private notificationsService: NotificationsService,
        private encryptionService: EncryptionService,
    ) { }

    async getSafetyTips(locationLabel: string) {
        return this.safetyTipRepository.find({
            where: { locationLabel },
            order: { createdAt: 'DESC' },
            take: 20
        });
    }

    async postSafetyTip(data: { userId: string, content: string, locationLabel: string }) {
        const tip = this.safetyTipRepository.create(data);
        const savedTip = await this.safetyTipRepository.save(tip);

        // Award XP for contributing to community knowledge
        await this.rewardsService.addXP(data.userId, 15, 'Community Safety Tip Shared');

        return savedTip;
    }



    async getHeatmap() {
        const scams = await this.scamReportRepository.find({
            where: { status: 'Verified' },
            take: 100
        });
        const sos = await this.sosEventRepository.find({ take: 50 });

        const mappedSos = sos.map(s => {
            try {
                const decryptedLoc = JSON.parse(this.encryptionService.decrypt(s.encryptedLocation));
                return { lat: Number(decryptedLoc.lat), lon: Number(decryptedLoc.long), weight: 1.0 };
            } catch (e) {
                return null;
            }
        }).filter(s => s !== null);

        return [
            ...scams.map(s => ({ lat: Number(s.lat), lon: Number(s.lon), weight: 0.8 })),
            ...mappedSos
        ];
    }

    async getRiskLevel(lat: number, lon: number) {
        const range = 0.02; // approx 2km
        const nearbyScams = await this.scamReportRepository.count({
            where: {
                lat: Between(lat - range, lat + range),
                lon: Between(lon - range, lon + range),
                status: 'Verified'
            }
        });

        const level = nearbyScams > 5 ? 'High' : nearbyScams > 2 ? 'Medium' : 'Low';

        return {
            level,
            description: level === 'High'
                ? 'High frequency of scams reported nearby. Stay alert.'
                : level === 'Medium'
                    ? 'Moderate risk detected. Keep an eye on your belongings.'
                    : 'Area is currently rated as safe by the community.',
            score: level === 'High' ? 80 : level === 'Medium' ? 50 : 20
        };
    }


    async triggerSOS(userId: string, location: { lat: number; long: number }) {
        this.logger.log(`SOS Triggered for user ${userId} at ${location.lat}, ${location.long}`);

        // Encrypt location history
        const encryptedLocation = this.encryptionService.encrypt(JSON.stringify(location));

        const event = this.sosEventRepository.create({
            userId,
            encryptedLocation,
            status: 'Active',
        });
        const savedEvent = await this.sosEventRepository.save(event);
        const incidentId = savedEvent.id;

        await this.redis.set(`sos_tracker:${incidentId}`, JSON.stringify(location), 'EX', 3600);

        // Notify Guardians Nearby
        const guardians = await this.rewardsService.getNearbyGuardians();
        const notificationBody = `URGENT: SOS active in your vicinity! Incident ID: ${incidentId}`;
        await this.notificationsService.notifyGuardiansNearby(
            guardians.map(g => ({ userId: g.userId, pushToken: g.pushToken })),
            'Emergency Alert',
            notificationBody,
            { incidentId, lat: location.lat, long: location.long }
        );

        return {

            status: 'active',
            message: 'Emergency services and trusted contacts have been notified.',
            incidentId,
        };
    }

    async updateLocation(incidentId: string, location: { lat: number; long: number }) {
        await this.redis.set(`sos_tracker:${incidentId}`, JSON.stringify(location), 'EX', 3600);
        return { status: 'updated' };
    }

    async getSOSLocation(incidentId: string) {
        const data = await this.redis.get(`sos_tracker:${incidentId}`);
        return data ? JSON.parse(data) : null;
    }

    async resolveSOS(incidentId: string) {
        this.logger.log(`SOS Incident ${incidentId} resolved`);

        await this.sosEventRepository.update(incidentId, {
            status: 'Resolved',
            resolvedAt: new Date()
        });

        await this.redis.del(`sos_tracker:${incidentId}`);
        return { status: 'resolved' };
    }

    async getNearbySafeZones(lat: number, lon: number) {
        return this.safeZoneRepository.find({ take: 10 });
    }

    async checkInAtSafeZone(userId: string, safeZoneId: number) {
        const zone = await this.safeZoneRepository.findOne({ where: { id: safeZoneId } });
        if (!zone) throw new Error('Safe Zone not found');

        this.logger.log(`User ${userId} checked in at ${zone.name}`);

        // Award XP via RewardsService
        await this.rewardsService.addXP(userId, 20, `Safe Zone Check-in: ${zone.name}`);

        return {
            status: 'success',
            message: `Checked in at ${zone.name}. You earned 20 XP!`,
            xpEarned: 20
        };
    }

    async seedSafeZones() {
        const zones = [
            // Rome Hub (Original)
            { name: "St. Peter's Pharmacy", type: 'Pharmacy', lat: 41.9022, lon: 12.4573, address: 'Via di Porta Angelica, 00120' },
            { name: "Rome Police HQ", type: 'Police', lat: 41.8992, lon: 12.4887, address: 'Via San Vitale, 15' },
            { name: "US Embassy Rome", type: 'Embassy', lat: 41.9062, lon: 12.4916, address: 'Via Vittorio Veneto, 121' },

            // London Hub
            { name: "Charing Cross Hospital", type: 'Medical', lat: 51.4885, lon: -0.2355, address: 'Fulham Palace Rd, London W6 8RF' },
            { name: "City of London Police", type: 'Police', lat: 51.5173, lon: -0.0911, address: '37 Wood St, London EC2V 7AF' },
            { name: "St Thomas Hospital (SOS Point)", type: 'Medical', lat: 51.4989, lon: -0.1186, address: 'Westminster Bridge Rd, London SE1 7EH' },

            // Paris Hub
            { name: "Hôpital Necker", type: 'Medical', lat: 48.8453, lon: 2.3156, address: '149 Rue de Sèvres, 75015 Paris' },
            { name: "Prefecture of Police Paris", type: 'Police', lat: 48.8546, lon: 2.3462, address: '1 Rue de la Cité, 75004 Paris' },
            { name: "Pharmacy of the 21st Century", type: 'Pharmacy', lat: 48.8566, lon: 2.3522, address: '7 Rue de Rivoli, 75004 Paris' },

            // Tokyo Hub
            { name: "The University of Tokyo Hospital", type: 'Medical', lat: 35.7119, lon: 139.7615, address: '7-3-1 Hongo, Bunkyo City, Tokyo 113-8655' },
            { name: "Metropolitan Police Department", type: 'Police', lat: 35.6764, lon: 139.7548, address: '2 Chome-1-1 Kasumigaseki, Chiyoda City, Tokyo 100-8929' },
            { name: "Shibuya Safe Point", type: 'Police', lat: 35.6585, lon: 139.7013, address: 'Shibuya Crossing Hub' }
        ];

        let count = 0;
        for (const zone of zones) {
            const exists = await this.safeZoneRepository.findOne({ where: { name: zone.name } });
            if (!exists) {
                await this.safeZoneRepository.save(this.safeZoneRepository.create(zone));
                count++;
            }
        }
        return { status: 'seeded', added: count };
    }
}

