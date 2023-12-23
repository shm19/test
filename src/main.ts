import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { json, Request } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));

  app.setGlobalPrefix('api/v1');

  morgan.token('ip', (req: Request) => req.ip);

  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length]  :ip',
    ),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port);
}

bootstrap();
