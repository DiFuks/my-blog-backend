import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject, optional } from 'inversify';
import { Server } from 'socket.io';
import { isEmpty } from 'lodash';

import { typesServices } from '@di/typesServices';
import { SocketRooms } from '@enum/SocketRooms';
import { typesConstants } from '@di/typesConstants';
import { LoggerService } from '@services/logger/LoggerService';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { SystemErrors } from '@services/systemError/SystemError';
import { ChatMessages } from '@entities/ChatMessages';

export interface IOptions {
  room: SocketRooms;
  data: any;
}

@provide(typesServices.SocketMessageSender)
export class MessageSender {
  private readonly socket: Server | undefined;
  private readonly loggerService: LoggerService;
  private readonly systemErrorFactory: SystemErrorFactory;

  constructor(
    @inject(typesConstants.Socket) @optional() socket: Server | undefined,
    @inject(typesServices.LoggerService) loggerService: LoggerService,
    @inject(typesServices.SystemErrorFactory) systemErrorFactory: SystemErrorFactory
  ) {
    this.socket = socket;
    this.loggerService = loggerService;
    this.systemErrorFactory = systemErrorFactory;
  }

  public async sendToChat(chatId: string, options: Array<IOptions>): Promise<Array<string>> {
    if (isEmpty(options)) {
      return [];
    }

    const chatRepository = getRepository(ChatMessages);

    const chatMessages = await chatRepository.findOne(chatId);

    if (!chatId) {
      return [];
    }

    const socketConnections = await chatMessages.socketConnections;

    const socketIds: Array<string> = [];

    socketConnections.forEach(socket => {
      this.socket.to(socket.socketId);
      socketIds.push(socket.socketId);
    });

    if (socketIds.length === 0) {
      await this.loggerService.info('WS: No socket connections was found for sending data', {
        extra: {
          chatId: chatId,
          socketIds: socketIds,
          connectionsCount: socketIds.length,
          options: options
        }
      });

      throw this.systemErrorFactory.create(SystemErrors.SOCKET_CONNECTIONS_DO_NOT_EXIST);
    }

    options.forEach(option => this.socket.emit(option.room, option.data));

    await this.loggerService.info('WS: Data has been sent to the chat', {
      extra: {
        chatId: chatId,
        options: options,
        socketIds: socketIds,
        connectionsCount: socketIds.length,
      }
    });

    return socketIds;
  }
}
