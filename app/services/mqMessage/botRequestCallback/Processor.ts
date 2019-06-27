import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { IProcessor } from '@services/mqMessage/IProcessor';
import { LoggerService } from '@services/logger/LoggerService';
import { Dto } from "@services/mqMessage/botRequestCallback/Dto";
import { ChatSenderService } from '@services/chat/ChatSenderService';

@provide(typesServices.MqMessageBotRequestCallbackProcessor)
export class Processor implements IProcessor {
  private readonly loggerService: LoggerService;

  private readonly chatSenderService: ChatSenderService;

  constructor(
    @inject(typesServices.LoggerService) loggerService: LoggerService,
    @inject(typesServices.ChatSenderService) chatSenderService: ChatSenderService,
  ) {
    this.loggerService = loggerService;
    this.chatSenderService = chatSenderService;
  }

  async process(data: Dto): Promise<void> {
    await Promise.all([
      this.chatSenderService.sendToSocket(data.ID, data.Message),
      this.loggerService.info('Get message from telegram bot', {
        extra: data
      }),
    ]);
  }
}
