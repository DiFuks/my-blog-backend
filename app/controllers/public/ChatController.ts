import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { ChatSenderService } from '@services/chat/ChatSenderService';
import { typesServices } from '@di/typesServices';
import { IChatRequest } from '@dto/request/IChatRequest';

export const enum ChatRoutes {
    ROOT = '/public/bot',
    SEND = '/send',
}

@controller(ChatRoutes.ROOT)
class ChatController extends BaseHttpController {
    private readonly chatSenderService: ChatSenderService;

    constructor(
        @inject(typesServices.ChatSenderService) chatSenderService: ChatSenderService,
    ) {
        super();
        this.chatSenderService = chatSenderService;
    }

    @httpPost(ChatRoutes.SEND, typesMiddlewares.RequestLogger)
    public async send(
        @requestBody() requestBody: IChatRequest,
    ) {
        await this.chatSenderService.sendToTelegram(requestBody);

        return this.ok({});
    }
}
