import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);
    private readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

    async getCopilotResponse(query: string, userId: string, history: any[] = [], language: string = 'en-US') {
        this.logger.log(`Forwarding chat query from user ${userId} to AI engine in ${language}`);
        try {
            const response = await axios.post(`${this.AI_SERVICE_URL}/chat/copilot`, {
                query,
                userId,
                history,
                context: {
                    location: 'Rome',
                    localTime: new Date().toISOString(),
                    userSafetyScore: 82,
                    preferredLanguage: language
                }
            });


            return response.data;
        } catch (error) {
            this.logger.error('Error contacting AI Copilot', error);
            return {
                reply: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
                sources: []
            };
        }
    }
}
