import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3003'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });
  
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap(); 