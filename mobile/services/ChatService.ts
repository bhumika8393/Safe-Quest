import Config from '@/constants/Config';
import * as Localization from 'expo-localization';

export const ChatService = {
    async sendMessage(query: string, userId: string, history: any[] = []) {
        try {
            const response = await fetch(`${Config.API_URL}/chat/copilot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    userId,
                    history,
                    language: Localization.locale || 'en-US'
                })
            });

            if (!response.ok) throw new Error('Failed to get AI response');
            return await response.json();
        } catch (error) {
            console.error('Chat Error:', error);
            return {
                reply: "I'm having a bit of trouble responding right now. Please check your connection.",
                sources: []
            };
        }
    }
};
