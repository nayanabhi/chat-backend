/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.userRepo.save(createUserDto);
  }

  async getSentMessage(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepo.findOne({
      where: { id: Number(userId) },
      relations: ['sentMessages'],
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return user?.sentMessages;
  }

  async getUsers(userId: any) {
    const users = await this.userRepo.find({
      where: {
        id: Not(userId),
      },
      select: ['id', 'fullName', 'phone'],
    });
    return users;
  }

  async getReceivedMessage(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepo.findOne({
      where: { id: Number(userId) },
      relations: ['receivedMessages'],
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return user?.receivedMessages;
  }
}
