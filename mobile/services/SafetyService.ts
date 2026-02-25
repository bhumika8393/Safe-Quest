import Config from '@/constants/Config';

export interface LocationData {
    lat: number;
    long: number;
}

export const SafetyService = {
    async triggerSOS(userId: string, location: LocationData) {
        try {
            const response = await fetch(Config.ENDPOINTS.SOS_TRIGGER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, location }),
            });

            if (!response.ok) {
                throw new Error('Failed to trigger SOS');
            }

            return await response.json();
        } catch (error) {
            console.error('SOS Trigger Error:', error);
            throw error;
        }
    },

    async resolveSOS(incidentId: string) {
        try {
            const response = await fetch(Config.ENDPOINTS.SOS_RESOLVE(incidentId), {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to resolve SOS');
            }

            return await response.json();
        } catch (error) {
            console.error('SOS Resolve Error:', error);
            throw error;
        }
    },

    async getNearbyScams() {
        try {
            const response = await fetch(Config.ENDPOINTS.NEARBY_SCAMS);
            if (!response.ok) {
                throw new Error('Failed to fetch nearby scams');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch Scams Error:', error);
            return [];
        }
    },

    async updateLocation(incidentId: string, location: LocationData) {
        try {
            const response = await fetch(Config.ENDPOINTS.SOS_TRACK_UPDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ incidentId, location }),
            });
            return await response.json();
        } catch (error) {
            console.error('Update Location Error:', error);
        }
    },

    async getRiskLevel(lat: number, lon: number) {
        try {
            const response = await fetch(`${Config.ENDPOINTS.RISK_LEVEL}?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch risk level');
            return await response.json();
        } catch (error) {
            console.error('Risk Level Error:', error);
            return null;
        }
    },

    async getNearbySafeZones(lat: number, lon: number) {
        try {
            const response = await fetch(`${Config.ENDPOINTS.SAFE_ZONES}?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch safe zones');
            return await response.json();
        } catch (error) {
            console.error('Safe Zones Error:', error);
            return [];
        }
    },

    async checkInAtSafeZone(userId: string, safeZoneId: number) {
        try {
            const response = await fetch(Config.ENDPOINTS.SAFE_ZONES_CHECKIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, safeZoneId }),
            });
            if (!response.ok) throw new Error('Failed to check in');
            return await response.json();
        } catch (error) {
            console.error('Check-in Error:', error);
            return null;
        }
    },

    async getHeatmap() {




        try {
            const response = await fetch(Config.ENDPOINTS.HEATMAP);
            if (!response.ok) {
                throw new Error('Failed to fetch heatmap');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch Heatmap Error:', error);
            return [];
        }
    }
};
