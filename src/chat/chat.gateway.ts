import { UseGuards } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/v1/message.service';
// import { WsJwtGuard } from 'src/auth/v1/ws-jwt.guard';

// @UseGuards(WsJwtGuard)
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    payload: { receiverId: string; message: string },
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const senderId: string = client.data.user.userId;
    console.log('Received message:', payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.messageService.createMessage(
      Number(senderId),
      Number(payload.receiverId),
      payload.message,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    // client.emit('messageResponse', 'Hello back from server!');
    // await this.messageService.createMessage(payload);

    // 2. Emit message back to sender (confirmation)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    // client.emit('messageResponse', {
    //   from: senderId,
    //   to: payload.receiverId,
    //   message: payload.message,
    //   status: 'sent',
    // });

    // 3. Emit message to receiver if connected
    const receiverSocketId = this.connectedClients.get(payload.receiverId);
    console.log(receiverSocketId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', {
        from: senderId,
        to: payload.receiverId,
        message: payload.message,
      });
    }
    return ;
  }

  private connectedClients: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = client.handshake.auth.token;
    if (!token) {
      console.log('Missing token');
      client.disconnect();
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      const payload = jwt.verify(token, secret);
      if (typeof payload === 'string') {
        throw new Error(
          'Invalid token payload: expected an object, got a string',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      client.data.user = payload; // Save user in socket for later use
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('User connected:', payload);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (this.connectedClients.has(payload.userId)) {
        console.log('User already connected, ignoring second attempt');
        return;
      }
      this.connectedClients.set(payload.userId, client.id);
      console.log(`User ${payload.userId} connected with socket ${client.id}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log('Invalid token');
      client.disconnect();
    }
    // console.log(536765836, token);
    // const userId = client.handshake.query.userId as string;
    // const payload = this.jwt.verify(token);
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // const user = client.data;
    // console.log(43534543, user);

    // if (!userId) {
    //   console.log('Connection rejected: userId missing');
    //   client.disconnect();
    //   return;
    // }

    // this.connectedClients.set(userId, client.id);
    // console.log(`User ${userId} connected with socket ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
}
