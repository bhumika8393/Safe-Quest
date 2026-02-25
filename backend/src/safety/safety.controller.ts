import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';

import { SafetyService } from './safety.service';

@Controller('safety')
export class SafetyController {
    constructor(private readonly safetyService: SafetyService) { }

    @Post('sos/trigger')
    async trigger(@Body() data: { userId: string; location: { lat: number; long: number } }) {
        return this.safetyService.triggerSOS(data.userId, data.location);
    }

    @Post('sos/resolve/:id')
    async resolve(@Param('id') incidentId: string) {
        return this.safetyService.resolveSOS(incidentId);
    }

    @Post('sos/tracker/update')
    async updateTracker(@Body() data: { incidentId: string; location: { lat: number; long: number } }) {
        return this.safetyService.updateLocation(data.incidentId, data.location);
    }

    @Get('sos/tracker/:id')
    async getTracker(@Param('id') incidentId: string) {
        return this.safetyService.getSOSLocation(incidentId);
    }


    @Get('scams/nearby')
    async getNearbyScams() {
        // Placeholder for scam detection logic
        return [
            { id: 1, type: 'Pickpocket', lat: 41.8892, lon: 12.4687, risk: 'High', label: 'Trastevere' },
            { id: 2, type: 'Fake Guide', lat: 41.8902, lon: 12.4922, risk: 'Medium', label: 'Colosseum' }
        ];
    }

    @Get('heatmap')
    async getSafetyHeatmap() {
        return this.safetyService.getHeatmap();
    }

    @Get('risk-level')
    async getRiskLevel(@Query('lat') lat: number, @Query('lon') lon: number) {
        return this.safetyService.getRiskLevel(Number(lat), Number(lon));
    }


    @Get('safe-zones/nearby')
    async getNearbySafeZones(@Query('lat') lat: number, @Query('lon') lon: number) {
        return this.safetyService.getNearbySafeZones(Number(lat), Number(lon));
    }

    @Post('admin/seed-safe-zones')
    async seedSafeZones() {
        return this.safetyService.seedSafeZones();
    }

    @Post('safe-zones/check-in')
    async checkIn(@Body() data: { userId: string, safeZoneId: number }) {
        return this.safetyService.checkInAtSafeZone(data.userId, data.safeZoneId);
    }

    @Get('tips')
    async getTips(@Query('location') location: string) {
        return this.safetyService.getSafetyTips(location);
    }

    @Post('tips')
    async postTip(@Body() data: { userId: string, content: string, location: string }) {
        return this.safetyService.postSafetyTip({
            userId: data.userId,
            content: data.content,
            locationLabel: data.location
        });
    }
}


