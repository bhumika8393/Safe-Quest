import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);
    private readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    // Built-in knowledge base for offline/local mode
    private readonly localKnowledge: Record<string, string> = {
        'tourist laws': '🏛️ **Rome Tourist Laws:**\n• It is illegal to sit on the Spanish Steps (fine up to €400).\n• Eating or drinking near major fountains and monuments can result in fines.\n• Street vendors selling counterfeit goods — buying from them is also illegal.\n• Always carry a valid ID or passport copy.',

        'tipping': '💰 **Tipping Etiquette in Rome:**\n• Tipping is not mandatory in Italy — a "coperto" (cover charge) is usually included.\n• Rounding up the bill or leaving €1-2 at restaurants is appreciated.\n• For exceptional service, 5-10% is generous.\n• Taxi drivers: round up to the nearest euro.',

        'bus ticket': '🚌 **Bus Ticket & Fines:**\n• A single BIT ticket costs €1.50 and is valid for 100 minutes.\n• You MUST validate your ticket on board — controllers check frequently.\n• Fine for riding without a validated ticket: €54.90 (if paid immediately) to €104.90.\n• Buy tickets at tabacchi shops, metro stations, or the Tabnet app.',

        'scam': '🚨 **Common Scams in Rome:**\n• **Gladiator photos**: People in costumes demand €20-50 for a photo.\n• **Friendship bracelets**: Someone ties a bracelet on your wrist and demands payment.\n• **Fake petitions**: Distraction technique while an accomplice pickpockets you.\n• **Overcharging taxis**: Always insist on the meter or agree on a price beforehand.\n• **Rose sellers**: Persistent vendors who place roses in your hand.',

        'emergency': '🆘 **Emergency Numbers in Italy:**\n• General Emergency: 112\n• Police (Carabinieri): 112\n• Ambulance: 118\n• Fire Department: 115\n• Tourist Police: 06-4686-2102',

        'transport': '🚇 **Rome Transport Guide:**\n• Metro has 3 lines: A (orange), B (blue), C (green).\n• Metro runs 5:30am-11:30pm (until 1:30am on Fri/Sat).\n• Night buses (marked "N") run after metro closes.\n• Official taxis are WHITE with a "TAXI" sign on top.\n• Use apps like FreeNow or itTaxi for safe rides.',

        'food': '🍝 **Food Safety Tips:**\n• Avoid restaurants with photos on the menu near tourist areas — often tourist traps.\n• Look for "trattoria" or "osteria" for authentic local food.\n• Tap water is safe to drink everywhere in Rome.\n• The public fountains ("nasoni") provide fresh drinking water.\n• Check reviews on Google Maps, not just TripAdvisor.',

        'safety': '🛡️ **General Safety in Rome:**\n• Rome is generally safe, but watch for pickpockets on buses 40, 64, and metro lines.\n• Keep valuables in front pockets or a cross-body bag.\n• Avoid poorly lit areas around Termini station at night.\n• Trastevere is lively but watch for drink spiking in bars.\n• The historic center is well-patrolled by police.',
    };

    async getCopilotResponse(query: string, userId: string, history: any[] = [], language: string = 'en-US') {
        this.logger.log(`Chat query from user ${userId}: "${query}" (lang: ${language})`);

        // Try the external AI service first
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
            }, { timeout: 3000 });

            return response.data;
        } catch (error) {
            this.logger.warn('AI service unavailable, using local knowledge base');
        }

        // Fallback: smart local responses
        const queryLower = query.toLowerCase();
        let reply = '';

        for (const [keyword, response] of Object.entries(this.localKnowledge)) {
            if (queryLower.includes(keyword)) {
                reply = response;
                break;
            }
        }

        if (!reply) {
            // Generic helpful response based on common patterns
            if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
                reply = '👋 Hello! I\'m your SafeQuest Travel Copilot. I can help you with:\n\n• 🏛️ Local laws & regulations\n• 💰 Tipping & cultural etiquette\n• 🚨 Scam awareness\n• 🚇 Transport guidance\n• 🍝 Food & restaurant tips\n• 🆘 Emergency contacts\n\nWhat would you like to know about Rome?';
            } else if (queryLower.includes('thank') || queryLower.includes('thanks')) {
                reply = '😊 You\'re welcome! Stay safe out there. Remember, you can always trigger the SOS button if you feel unsafe. Is there anything else I can help with?';
            } else if (queryLower.includes('weather') || queryLower.includes('climate')) {
                reply = '☀️ **Rome Weather Tips:**\n• Summer (Jun-Aug): Hot, 30-35°C. Stay hydrated and visit museums during peak heat.\n• Winter (Dec-Feb): Mild, 5-12°C. Bring a light jacket.\n• Spring/Fall: Best time to visit! 15-25°C with fewer crowds.\n• Always carry a water bottle — refill at public "nasoni" fountains.';
            } else if (queryLower.includes('hotel') || queryLower.includes('stay') || queryLower.includes('accommodation')) {
                reply = '🏨 **Safe Areas to Stay in Rome:**\n• **Centro Storico**: Heart of Rome, walkable to everything.\n• **Trastevere**: Charming, nightlife, but watch for pickpockets.\n• **Prati**: Near Vatican, quieter, good restaurants.\n• **Monti**: Trendy, safe neighborhood near Colosseum.\n• ⚠️ **Avoid**: Areas immediately around Termini station for budget hotels.';
            } else {
                reply = `🤔 Great question about "${query}"! Here\'s what I know:\n\nRome is a vibrant city with a rich history. For your specific query, I recommend:\n\n1. 📱 Check the SafeQuest heatmap for real-time safety data\n2. 🗺️ Visit nearby Safe Zones for help\n3. 👥 Ask our community for local tips\n\nYou can also try asking me about: **tourist laws**, **tipping**, **scams**, **transport**, **food safety**, or **emergency contacts**.`;
            }
        }

        return {
            reply,
            sources: ['SafeQuest Local Knowledge Base'],
            mode: 'offline'
        };
    }
}
