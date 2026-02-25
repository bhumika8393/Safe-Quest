const API_URL = 'http://localhost:3000'; // Change to your local IP for physical device testing

export default {
    API_URL,
    ENDPOINTS: {
        SOS_TRIGGER: `${API_URL}/safety/sos/trigger`,
        SOS_RESOLVE: (id: string) => `${API_URL}/safety/sos/resolve/${id}`,
        NEARBY_SCAMS: `${API_URL}/safety/scams/nearby`,
        HEATMAP: `${API_URL}/safety/heatmap`,
        AI_CHAT: `${API_URL}/chat/copilot`,
        GET_USER_STATS: (id: string) => `${API_URL}/rewards/stats/${id}`,
        LEADERBOARD: `${API_URL}/rewards/leaderboard`,
        SOS_TRACK_UPDATE: `${API_URL}/safety/sos/tracker/update`,

        RISK_LEVEL: `${API_URL}/safety/risk-level`,
        SAFE_ZONES: `${API_URL}/safety/safe-zones/nearby`,
        SAFE_ZONES_CHECKIN: `${API_URL}/safety/safe-zones/check-in`,
    },
};




