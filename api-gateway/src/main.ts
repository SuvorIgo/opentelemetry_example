import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OtelNodeSDK } from './instrumentation';

async function bootstrap() {
  OtelNodeSDK.start();

  const app = await NestFactory.create(AppModule);
  await app.listen(3444);
}
bootstrap();
