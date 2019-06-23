import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';
import { ChatMessages } from '@entities/ChatMessages';
import { RestWorker } from '@rest/bot/RestWorker';
import { typesREST } from '@di/typesREST';
import { ChatMessageTypes } from '@enum/ChatMessageTypes';

@provide(typesServices.ChatSenderService)
export class ChatSenderService {
    private readonly botRestWorker: RestWorker;

    constructor(
        @inject(typesREST.BotRESTWorker) botRestWorker: RestWorker,
    ) {
        this.botRestWorker = botRestWorker;
    }

    public async sendToTelegram(chatRequest: IChatRequest): Promise<void> {
        const chatRepository = getRepository(ChatMessages);

        const chatMessages = await chatRepository.findOne(chatRequest.id) || new ChatMessages();

        chatMessages.messages.push({
            text: chatRequest.message,
            date: new Date(),
            type: ChatMessageTypes.USER,
        });
        chatMessages.id = chatRequest.id;
        chatMessages.name = chatRequest.name;

        await Promise.all([
            chatRepository.save(chatMessages),
            this.botRestWorker.send(chatRequest),
        ]);
    }

    public async sendToSocket(id: string, message: string): Promise<void> {
        // TODO send to socket
        const chatRepository = getRepository(ChatMessages);

        const chatMessages = await chatRepository.findOne(id);

        chatMessages.messages.push({
            text: message,
            date: new Date(),
            type: ChatMessageTypes.ME,
        });

        await chatRepository.save(chatMessages);
    }
}
