import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/v1/jwt-auth.guard';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { user };
  }

  @Get(':userId/messages/sent')
  getSentMessages(@Param('userId') userId: string) {
    return this.userService.getSentMessage(userId);
  }

  @Get(':userId/messages/received')
  getReceivedMessages(@Param('userId') userId: string) {
    return this.userService.getReceivedMessage(userId);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getUser(@Request() req) {
    console.log(5464564, req);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.userService.getUsers(req.user.userId);
  }
}
