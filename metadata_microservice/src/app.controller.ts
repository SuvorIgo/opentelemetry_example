import { Controller, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OpenTelemetryInterceptor } from './interceptors/opentelemetry.interceptor';
import { OtelSpan } from './decorators/otel-span.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @OtelSpan()
  @UseInterceptors(OpenTelemetryInterceptor)
  @MessagePattern('get-metadata')
  getMetadata(@Payload() data: any): Object {
    return this.appService.getMetadata(data);
  }
}
