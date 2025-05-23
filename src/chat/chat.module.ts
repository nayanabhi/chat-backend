// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/v1/auth.module';
import { AuthService } from 'src/auth/v1/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from 'src/message/v1/message.service';
import { MessageModule } from 'src/message/v1/message.module';

@Module({
  imports: [AuthModule, MessageModule],
  providers: [ChatGateway, AuthService, JwtService, MessageService],
})
export class ChatModule {}
