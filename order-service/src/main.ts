import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure global pipes with custom validation
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion for simpler client requests
      },
    }),
  );
  
  await app.listen(3002);
  console.log(`Order Service is running on: ${await app.getUrl()}`);
}
bootstrap(); 