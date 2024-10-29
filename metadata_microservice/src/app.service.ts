import { Injectable } from '@nestjs/common';
import * as openTelemetry from '@opentelemetry/api';

@Injectable()
export class AppService {
  getMetadata(data: any): Object {
    this.setAttributesInSpan(openTelemetry.trace.getActiveSpan(), {
      'messaging.system': 'nats',
      'messaging.destination': 'get-metadata',
      'messaging.operation': 'send',
      'messaging.host': 'localhost',
      'messaging.port': 4222
    })

    return {
      metadata: 'text metadata'
    }
  }

  private setAttributesInSpan(span: openTelemetry.Span, attributes: openTelemetry.Attributes): void {
    span.setAttributes(attributes);
  }
}
