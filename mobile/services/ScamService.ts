import Config from '@/constants/Config';

export interface ScamReport {
    text: string;
    lat: number;
    lon: number;
    userId: string;
    evidenceUrl?: string;
    evidenceType?: string;
}


export const ScamService = {
    async reportScam(report: ScamReport) {
        try {
            const response = await fetch(`${Config.API_URL}/scams/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(report),
            });

            if (!response.ok) throw new Error('Failed to submit scam report');
            return await response.json();

        } catch (error) {
            console.error('Report Scam Error:', error);
            throw error;
        }
    },

    async uploadEvidence(fileUri: string) {
        try {
            const formData = new FormData();
            // @ts-ignore
            formData.append('file', {
                uri: fileUri,
                name: 'evidence.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch(`${Config.API_URL}/scams/evidence/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Upload failed');
            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },


    async getNearbyScams(lat: number, lon: number) {
        try {
            const response = await fetch(`${Config.API_URL}/scams/nearby?lat=${lat}&lon=${lon}`);
            if (!response.ok) {
                throw new Error('Failed to fetch nearby scams');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch Nearby Scams Error:', error);
            return [];
        }
    },

    async getPendingReports() {
        try {
            const response = await fetch(`${Config.API_URL}/scams/admin/pending`);
            if (!response.ok) throw new Error('Failed to fetch pending reports');
            return await response.json();
        } catch (error) {
            console.error('Fetch Pending Error:', error);
            return [];
        }
    },

    async verifyReport(id: string, isVerified: boolean) {
        try {
            const response = await fetch(`${Config.API_URL}/scams/verify/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVerified })
            });
            if (!response.ok) throw new Error('Failed to verify report');
            return await response.json();
        } catch (error) {
            console.error('Verify Error:', error);
            throw error;
        }
    }
};

