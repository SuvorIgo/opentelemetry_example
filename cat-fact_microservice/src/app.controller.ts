import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenTelemetryInterceptor } from './interceptors/opentelemetry.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @OtelSpan() // Данный функционал почти завершил, работаю с передачей контекста из одного декоратора в другой (чтобы получить payload) С помощью него не нужно будет создавать спан с конфигом в коде и вообще не взаимодействовать с ним в коде
  @UseInterceptors(OpenTelemetryInterceptor)
  @MessagePattern('get-cat-fact')
  getCatFact(@Payload() data: any): Promise<any> {
    return this.appService.getCatFact(data);
  }
}
