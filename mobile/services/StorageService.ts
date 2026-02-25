import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    SAFE_PLACES: 'safe_quest_places',
    CULTURAL_INSIGHTS: 'safe_quest_insights',
    EMERGENCY_CONTACTS: 'safe_quest_contacts',
    OFFLINE_MODE: 'safe_quest_offline_mode',
};

export const StorageService = {
    async saveSafePacks(data: { places: any[], insights: any[], contacts: any[] }) {
        try {
            await AsyncStorage.setItem(KEYS.SAFE_PLACES, JSON.stringify(data.places));
            await AsyncStorage.setItem(KEYS.CULTURAL_INSIGHTS, JSON.stringify(data.insights));
            await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(data.contacts));
            return true;
        } catch (error) {
            console.error('Storage Error:', error);
            return false;
        }
    },

    async getSafePlaces() {
        const data = await AsyncStorage.getItem(KEYS.SAFE_PLACES);
        return data ? JSON.parse(data) : [];
    },

    async getCulturalInsights() {
        const data = await AsyncStorage.getItem(KEYS.CULTURAL_INSIGHTS);
        return data ? JSON.parse(data) : [];
    },

    async getEmergencyContacts() {
        const data = await AsyncStorage.getItem(KEYS.EMERGENCY_CONTACTS);
        return data ? JSON.parse(data) : [];
    },

    async setOfflineMode(enabled: boolean) {
        await AsyncStorage.setItem(KEYS.OFFLINE_MODE, JSON.stringify(enabled));
    },

    async isOfflineMode() {
        const data = await AsyncStorage.getItem(KEYS.OFFLINE_MODE);
        return data ? JSON.parse(data) : false;
    }
};
