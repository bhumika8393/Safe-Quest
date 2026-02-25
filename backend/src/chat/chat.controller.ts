import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('copilot')
    async copilot(@Body() data: { query: string; userId: string; history?: any[]; language?: string }) {
        return this.chatService.getCopilotResponse(data.query, data.userId, data.history, data.language);
    }


}
