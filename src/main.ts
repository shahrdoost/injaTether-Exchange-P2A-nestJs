import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {AppConfig} from './app.config';
import { init as SentryInit } from '@sentry/node';
import { SocketAdapter } from './adaptor';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { urlencoded, json } from 'express';
import * as bodyParser from 'body-parser';
// hi again
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/uploadsssssssssefwgweh/kyc/', express.static(process.cwd() + '/uploads/kyc'));
 // app.useStaticAssets(join(__dirname, '..', 'uploads/kyc'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const config = app.get(AppConfig);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(config.port);
  SentryInit({
    dsn: 'sentryTokenAddress',
    tracesSampleRate: 1.0,
  });
}
bootstrap();
