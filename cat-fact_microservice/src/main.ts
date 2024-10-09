import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OtelNodeSDK } from './instrumentation';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  OtelNodeSDK.start();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222']
    }
  });

  app.listen();
}
bootstrap();
