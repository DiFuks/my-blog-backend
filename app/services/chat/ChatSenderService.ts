import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';
import { ChatMessages } from '@entities/ChatMessages';
import { RestWorker } from '@rest/bot/RestWorker';
import { inject } from 'inversify';
import { typesREST } from '@di/typesREST';

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

        chatMessages.messages.push(chatRequest.message);
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

        chatMessages.messages.push(message);

        await chatRepository.save(chatMessages);
    }
}
