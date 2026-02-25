import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    // Expo Push Notification API
    private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

    async sendPushNotification(token: string, title: string, body: string, data: any = {}) {
        if (!token) return;

        this.logger.log(`Sending push to ${token}: ${title}`);

        try {
            // In a real app, we would use expo-server-sdk or firebase-admin
            await axios.post(this.EXPO_PUSH_URL, {
                to: token,
                sound: 'default',
                title: title,
                body: body,
                data: data,
                priority: 'high',
            });
        } catch (error) {
            this.logger.error(`Failed to send notification to ${token}`, error);
        }
    }

    async notifyGuardiansNearby(guardians: { userId: string, pushToken: string }[], title: string, body: string, data: any) {
        this.logger.log(`Notifying ${guardians.length} guardians`);
        for (const guardian of guardians) {
            await this.sendPushNotification(guardian.pushToken, title, body, data);
        }
    }
}
