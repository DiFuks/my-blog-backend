import { BaseHttpController, controller, httpGet, httpPost, requestBody, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { ChatSenderService } from '@services/chat/ChatSenderService';
import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';
import { ChatService } from '@services/chat/ChatService';

export const enum ChatRoutes {
  ROOT = '/public/bot',
  SEND = '/send',
  GET_ID = '/getId',
  GET_MESSAGES = '/getMessages/:id',
}

@controller(ChatRoutes.ROOT)
class ChatController extends BaseHttpController {
  private readonly chatSenderService: ChatSenderService;
  private readonly chatService: ChatService;

  constructor(
    @inject(typesServices.ChatSenderService) chatSenderService: ChatSenderService,
    @inject(typesServices.ChatService) chatService: ChatService,
  ) {
    super();

    this.chatSenderService = chatSenderService;
    this.chatService = chatService;
  }

  @httpPost(ChatRoutes.SEND, typesMiddlewares.RequestLogger)
  public async send(
    @requestBody() requestBody: IChatRequest,
  ) {
    const messages = await this.chatSenderService.sendToTelegram(requestBody);

    return this.json(messages);
  }

  @httpGet(ChatRoutes.GET_ID, typesMiddlewares.RequestLogger)
  public async getId() {
    return this.json(await this.chatService.generateId());
  }

  @httpGet(ChatRoutes.GET_MESSAGES, typesMiddlewares.RequestLogger)
  public async getMessages(
    @requestParam('id') id: string,
  ) {
    return this.json(await this.chatService.getMessagesById(id));
  }
}
