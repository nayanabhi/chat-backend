import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import * as cookieParser from 'cookie-parser';

class CustomSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
  }
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001', // your frontend origin
    credentials: true,
  });
  app.useWebSocketAdapter(new CustomSocketIoAdapter(app));

  await app.listen(3000);
}
bootstrap();
