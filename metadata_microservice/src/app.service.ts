import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as openTelemetry from '@opentelemetry/api';

@Injectable()
export class AppService {
  getMetadata(data: any): Object {
    const activeSpanContext: openTelemetry.Context = openTelemetry.propagation.extract(openTelemetry.context.active(), data.spanContext);
    const span: openTelemetry.Span = openTelemetry.trace.getTracer('default').startSpan('AppService.getMetadata', {}, activeSpanContext);

    try {
      return {
        metadata: 'text metadata'
      }
    } catch (err) {
      console.log(err);
      throw new RpcException(err);
    } finally {
      span.end();
    }
  }
}
