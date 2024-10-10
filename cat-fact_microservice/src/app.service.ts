import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices';
import * as openTelemetry from '@opentelemetry/api';
import { lastValueFrom } from 'rxjs';
import * as nats from 'nats';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('METADATA_MICROSERVICE')
    private readonly metadataClient: ClientProxy,
  ) { }

  async getCatFact(data: any): Promise<any> {
    const outputContext = {};
    openTelemetry.propagation.inject(
      openTelemetry.propagation.extract(openTelemetry.context.active(), data.spanContext),
      outputContext
    );
    const headers = this.getNatsHeadersFromSpanContext(outputContext);
    const getMetadataRecord = new NatsRecordBuilder().setHeaders(headers).setData({}).build();

    const url = 'https://catfact.ninja/facts';

    const resultData = (await this.httpService.axiosRef.get(url)).data;

    const metadata = await lastValueFrom(this.metadataClient.send('get-metadata', getMetadataRecord));

    resultData.metadata = metadata;

    return resultData;
  }

  private getNatsHeadersFromSpanContext(spanContext) {
    const headers = nats.headers();

    headers.set('x-b3-traceid', spanContext['x-b3-traceid']);
    headers.set('x-b3-spanid', spanContext['x-b3-spanid']);
    headers.set('x-b3-sampled', spanContext['x-b3-sampled']);
    headers.set('uber-trace-id', spanContext['uber-trace-id']);
    headers.set('traceparent', spanContext['traceparent']);
    headers.set('b3', spanContext['b3']);

    return headers;
  }
}
