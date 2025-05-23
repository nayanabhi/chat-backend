import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/v1/user.entity';
import { Message } from './message/v1/message.entity';
import { UserModule } from './user/v1/user.module';
import { AuthModule } from './auth/v1/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/v1/jwt-auth.guard';
import { ChatModule } from './chat/chat.module';
import { AuthService } from './auth/v1/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './message/v1/message.service';
import { MessageModule } from './message/v1/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // For managing environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Message],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    JwtService,
    MessageService,
  ],
})
export class AppModule {}
