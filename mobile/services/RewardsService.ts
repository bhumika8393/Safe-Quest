import Config from '@/constants/Config';

export interface UserStats {
    userId: string;
    xp: number;
    level: number;
    badges: string[];
    safetyScore: number;
    trustLevel?: string;
}

export const RewardsService = {
    async getUserStats(userId: string): Promise<UserStats | null> {
        try {
            const response = await fetch(Config.ENDPOINTS.GET_USER_STATS(userId));
            if (!response.ok) {
                throw new Error('Failed to fetch user stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch Stats Error:', error);
            return null;
        }
    },

    async getLeaderboard() {
        try {
            const response = await fetch(`${Config.API_URL}/rewards/leaderboard`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Leaderboard Fetch Error:', error);
            return [];
        }
    },

    async updatePushToken(userId: string, token: string) {
        try {
            await fetch(`${Config.API_URL}/rewards/stats/${userId}/token`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pushToken: token })
            });
        } catch (error) {
            console.error('Update Token Error:', error);
        }
    }
};
