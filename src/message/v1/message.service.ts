import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}
  public async createMessage(
    sender: number,
    receiver: number,
    content: string,
  ) {
    await this.messageRepo.save({
      sender: { id: sender },
      receiver: { id: receiver },
      message: content,
    });
  }

  async getChatHistory(userId: string, receiverId: string) {
    // const chatHistory = await this.messageRepo.find({
    //   where: [
    //     { sender: { id: userId }, receiver: { id: receiverId } },
    //     { sender: { id: receiverId }, receiver: { id: userId } },
    //   ],
    //   relations: ['sender', 'receiver'],
    //   order: {
    //     timestamp: 'ASC',
    //   },
    // });
    const chatHistory = await this.messageRepo.find({
      where: [
        {
          sender: { id: Number(userId) },
          receiver: { id: Number(receiverId) },
        },
        {
          sender: { id: Number(receiverId) },
          receiver: { id: Number(userId) },
        },
      ],
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'ASC',
      },
    });
    return chatHistory.map((msg) => ({
      text: msg.message,
      sender: msg.sender.id == Number(userId) ? 'You' : msg.sender.fullName,
    }));
    return chatHistory;
  }

  //   async getAllMessage(senderId: Number) {
  //     Message.findAl
  //   }
}
