import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('history/:receiverId')
  getChatHistory(@Request() req, @Param('receiverId') receiverId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.messageService.getChatHistory(req.user.userId, receiverId);
  }

  //   @Get()
  //   getUser() {
  //     return { message: 'User endpoint working' };
  //   }
}
