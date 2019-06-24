import { provide } from 'inversify-binding-decorators';
import { v4 as uuid } from 'uuid';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { IChatId } from '@dto/reponse/IChatId';
import { ChatMessages, IMessage } from '@entities/ChatMessages';

@provide(typesServices.ChatService)
export class ChatService {
    public async getMessagesById(id: string): Promise<Array<IMessage>> {
        const chatRepository = getRepository(ChatMessages);

        const chatMessages = await chatRepository.findOne(id);

        return chatMessages ? chatMessages.messages : [];
    }

    public generateId(): IChatId {
        return {
            id: uuid(),
        };
    }
}
