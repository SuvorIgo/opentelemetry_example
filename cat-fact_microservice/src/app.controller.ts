import { Controller, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenTelemetryInterceptor } from './interceptors/opentelemetry.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OtelSpan } from './decorators/otel-span.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @OtelSpan()
  @UseInterceptors(OpenTelemetryInterceptor)
  @MessagePattern('get-cat-fact')
  getCatFact(@Payload() data: any): Promise<any> {
    return this.appService.getCatFact(data);
  }
}
