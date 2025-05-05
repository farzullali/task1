import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('OrderService');
  
  // Create a pure microservice application
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'order_queue',
        queueOptions: {
          durable: false,
        },
      },
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      },
  );

  await app.listen();
  logger.log('Order Microservice is listening');
}
bootstrap(); 