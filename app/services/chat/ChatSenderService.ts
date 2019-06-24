import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';
import { ChatMessages, IMessage } from '@entities/ChatMessages';
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

    public async sendToTelegram(chatRequest: IChatRequest): Promise<Array<IMessage>> {
        const chatRepository = getRepository(ChatMessages);

        const chatMessages = await chatRepository.findOne(chatRequest.id) || new ChatMessages();

        chatMessages.messages.push({
            message: chatRequest.message,
            date: new Date(),
            type: ChatMessageTypes.USER,
        });
        chatMessages.id = chatRequest.id;

        await Promise.all([
            chatRepository.save(chatMessages),
            this.botRestWorker.send(chatRequest),
        ]);

        return chatMessages.messages;
    }

    public async sendToSocket(id: string, message: string): Promise<void> {
        // TODO send to socket
        const chatRepository = getRepository(ChatMessages);

        const chatMessages = await chatRepository.findOne(id);

        chatMessages.messages.push({
            message: message,
            date: new Date(),
            type: ChatMessageTypes.ME,
        });

        await chatRepository.save(chatMessages);
    }
}
