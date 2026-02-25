import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import axios from 'axios';
import { RewardsService } from '../rewards/rewards.service';
import { ScamReport } from './entities/scam-report.entity';

@Injectable()
export class ScamsService {
    private readonly logger = new Logger(ScamsService.name);
    private readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

    constructor(
        @InjectRepository(ScamReport)
        private readonly scamReportRepository: Repository<ScamReport>,
        private readonly rewardsService: RewardsService,
    ) { }

    async reportScam(data: { text: string; lat: number; lon: number; userId: string; evidenceUrl?: string; evidenceType?: string }) {
        this.logger.log(`New scam report from user ${data.userId}`);

        try {
            const aiResponse = await axios.post(`${this.AI_SERVICE_URL}/analyze-scam`, {
                text: data.text,
                lat: data.lat,
                lon: data.lon
            });

            const analysis = aiResponse.data;

            const report = this.scamReportRepository.create({
                userId: data.userId,
                lat: data.lat,
                lon: data.lon,
                description: data.text,
                type: analysis.scam_type,
                riskScore: analysis.estimated_risk,
                status: 'Pending',
                evidenceUrl: data.evidenceUrl,
                evidenceType: data.evidenceType,
            });

            await this.scamReportRepository.save(report);

            // Award initial reporting XP
            let xpEarned = 50;
            if (analysis.estimated_risk > 0.7) {
                xpEarned += 100;
                await this.rewardsService.addXP(data.userId, 150, 'High Risk Scam Detection');
            } else {
                await this.rewardsService.addXP(data.userId, 50, 'Scam Reporting');
            }

            return {
                status: 'received',
                analysis: analysis,
                message: analysis.estimated_risk > 0.5
                    ? `High risk pattern detected. You earned ${xpEarned} XP!`
                    : `Report received. You earned ${xpEarned} XP!`
            };
        } catch (error) {
            this.logger.error('Error calling AI Service or Saving to DB', error);
            return {
                status: 'error',
                message: 'Could not process report fully, but it has been logged for review.'
            };
        }
    }

    async verifyReport(reportId: string, isVerified: boolean) {
        const report = await this.scamReportRepository.findOne({ where: { id: reportId } });
        if (!report) throw new Error('Report not found');

        report.status = isVerified ? 'Verified' : 'Dismissed';
        await this.scamReportRepository.save(report);

        if (isVerified) {
            await this.rewardsService.addXP(report.userId, 150, 'Verified Scam Report');
            await this.rewardsService.updateSafetyScore(report.userId, 5);
        } else {
            await this.rewardsService.updateSafetyScore(report.userId, -2);
        }

        return { status: report.status };
    }

    async getNearbyScams(lat: number, lon: number) {
        // Range in meters (e.g., 5000m = 5km)
        const radiusInMeters = 5000;

        // In a real production DB with PostGIS:
        // return this.scamReportRepository
        //     .createQueryBuilder('scam')
        //     .where('ST_DWithin(scam.location, ST_MakePoint(:lon, :lat)::geography, :radius)', {
        //         lon,
        //         lat,
        //         radius: radiusInMeters
        //     })
        //     .getMany();

        // For this MVP environment (standard Postgres), we use a refined bounding box query
        const range = 0.05; // approx 5km
        return this.scamReportRepository.find({
            where: {
                lat: Between(lat - range, lat + range),
                lon: Between(lon - range, lon + range),
                status: 'Verified' // Only show verified scams on the map for safety
            },
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }

    async getPendingReports() {
        return this.scamReportRepository.find({
            where: { status: 'Pending' },
            order: { createdAt: 'DESC' },
            take: 50
        });
    }

    async seedScams() {
        const initialScams = [
            { type: 'Pickpocket', lat: 48.8584, lon: 2.2945, description: 'High activity near Eiffel Tower entrance.', riskScore: 0.9, status: 'Verified', userId: 'system' },
            { type: 'Fake Ticket', lat: 51.5007, lon: -0.1246, description: 'Individuals selling fake Big Ben tour tickets.', riskScore: 0.7, status: 'Verified', userId: 'system' },
            { type: 'ATM Scam', lat: 35.6595, lon: 139.7004, description: 'Card skimming reported at non-bank ATMs in Shibuya.', riskScore: 0.8, status: 'Verified', userId: 'system' },
            { type: 'Taxi Markup', lat: 41.9009, lon: 12.4833, description: 'Unmetered taxis operating around Trevi Fountain.', riskScore: 0.6, status: 'Verified', userId: 'system' }
        ];

        for (const scam of initialScams) {
            const exists = await this.scamReportRepository.findOne({ where: { description: scam.description } });
            if (!exists) {
                await this.scamReportRepository.save(this.scamReportRepository.create(scam));
            }
        }
        return { status: 'scams_seeded' };
    }
}



