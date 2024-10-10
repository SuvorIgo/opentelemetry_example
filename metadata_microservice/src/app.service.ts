import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as openTelemetry from '@opentelemetry/api';

@Injectable()
export class AppService {
  getMetadata(data: any): Object {
    return {
      metadata: 'text metadata'
    }
  }
}
