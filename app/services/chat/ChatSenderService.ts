import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';
import { ChatMessages, IMessage } from '@entities/ChatMessages';
import { RestWorker } from '@rest/bot/RestWorker';
import { typesREST } from '@di/typesREST';
import { ChatMessageTypes } from '@enum/ChatMessageTypes';
import { MessageSender } from '@services/socket/MessageSender';
import { SocketRooms } from '@enum/SocketRooms';

@provide(typesServices.ChatSenderService)
export class ChatSenderService {
  private readonly botRestWorker: RestWorker;
  private readonly socketMessageSender: MessageSender;

  constructor(
    @inject(typesREST.BotRESTWorker) botRestWorker: RestWorker,
    @inject(typesServices.SocketMessageSender) socketMessageSender: MessageSender
  ) {
    this.botRestWorker = botRestWorker;
    this.socketMessageSender = socketMessageSender;
  }

  public async sendToTelegram(chatRequest: IChatRequest): Promise<Array<IMessage>> {
    await this.botRestWorker.send(chatRequest);

    const chatRepository = getRepository(ChatMessages);

    const chatMessages = await chatRepository.findOne(chatRequest.id) || new ChatMessages();

    chatMessages.messages.push({
      message: chatRequest.message,
      date: new Date(),
      type: ChatMessageTypes.USER,
    });
    chatMessages.id = chatRequest.id;

    await chatRepository.save(chatMessages);

    return chatMessages.messages;
  }

  public async sendToSocket(id: string, message: string): Promise<void> {
    const chatRepository = getRepository(ChatMessages);

    const chatMessages = await chatRepository.findOne(id);

    chatMessages.messages.push({
      message: message,
      date: new Date(),
      type: ChatMessageTypes.ME,
    });

    await this.socketMessageSender.sendToChat(chatMessages.id, [{
      room: SocketRooms.BOT_REQUEST_CALLBACK,
      data: null
    }]);

    await chatRepository.save(chatMessages);
  }
}
