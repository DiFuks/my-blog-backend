import { provide } from 'inversify-binding-decorators';
import { Socket } from 'socket.io';

import { typesServices } from '@di/typesServices';
import { DeleteResult, getRepository } from 'typeorm';
import { SocketConnections } from '@entities/SocketConnections';
import { ChatMessages } from '@entities/ChatMessages';

@provide(typesServices.SocketUserConnectionManager)
export class UserConnectionManager {
  public async add(chat: ChatMessages, socket: Socket): Promise<SocketConnections> {
    const socketConnectionsRepository = getRepository(SocketConnections);

    let socketConnection = await socketConnectionsRepository.findOne({
      where: {
        socketId: socket.id,
        chat: chat,
      }
    });

    if (!socketConnection) {
      socketConnection = socketConnectionsRepository.create({
        socketId: socket.id,
        chat: chat
      });

      await socketConnectionsRepository.save(socketConnection);
    }

    return socketConnection;
  }

  remove(socket: Socket): Promise<DeleteResult> {
    const socketConnectionsRepository = getRepository(SocketConnections);

    return socketConnectionsRepository.delete({
      socketId: socket.id
    });
  }

  async removeAllConnections(): Promise<void> {
    const socketConnectionsRepository = getRepository(SocketConnections);

    await socketConnectionsRepository.clear();
  }
}
