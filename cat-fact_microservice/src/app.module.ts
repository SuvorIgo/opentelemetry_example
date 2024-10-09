import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule.register({}),
    ClientsModule.register([
      {
        name: 'METADATA_MICROSERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222']
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
