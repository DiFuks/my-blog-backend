import { has, isObject } from 'lodash';
import { Container } from 'inversify';
import * as socket from 'socket.io';
import { getRepository } from 'typeorm';
import { Server } from 'http';
import { Socket } from 'socket.io';

import { typesServices } from '@di/typesServices';
import { UserConnectionManager } from '@services/socket/UserConnectionManager';
import { typesConstants } from '@di/typesConstants';
import { ChatMessages } from '@entities/ChatMessages';

const getChatBySocket = async (socket: Socket): Promise<ChatMessages> => {
  if (has(socket.handshake, 'query.id')) {
    const id = socket.handshake.query.id;

    const chatRepository = getRepository(ChatMessages);

    const chatMessages = await chatRepository.findOne(id);

    if (isObject(chatMessages)) {
      return chatMessages;
    }

    throw new Error('No chat has been found');
  } else {
    throw new Error('No id is provided');
  }
};

export const init = (server: Server, container: Container) => {
  const io = socket(server);

  let socketChat: ChatMessages;

  io.use(async (socket, next) => {
    try {
      socketChat = await getChatBySocket(socket);

      next();
    } catch (err) {
      next(err);
    }
  });

  io.use(async (socket: Socket, next) => {
    const userConnectionManager = container.get<UserConnectionManager>(typesServices.SocketUserConnectionManager);

    await userConnectionManager.add(socketChat, socket);

    socket.on('disconnect', async () => {
      await userConnectionManager.remove(socket);
    });

    next();
  });

  container.bind<socket.Server>(typesConstants.Socket).toConstantValue(io);

  return io;
};
