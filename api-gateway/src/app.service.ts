import { Injectable, Inject } from '@nestjs/common';
import * as openTelemetry from '@opentelemetry/api';
import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices';
import * as nats from 'nats'

@Injectable()
export class AppService {
  constructor(
    @Inject('CAT-FACT_MICROSERVICE')
    private readonly catFactClient: ClientProxy
  ) { }

  async getCatFact(): Promise<any> {
    const outputSpanContext = {};
    openTelemetry.propagation.inject(openTelemetry.context.active(), outputSpanContext); // Обертка родительского спана в отправляемый контекст в микросервисы

    const headers = this.getNatsHeadersFromSpanContext(outputSpanContext); // Хедеры с данными родительского спана
    const record = new NatsRecordBuilder().setHeaders(headers).setData({}).build(); // Генерация данных для отправки сообщения в nats

    return this.catFactClient.send('get-cat-fact', record);
  }

  /**
   * Функция получения хедеров из контекста спан
   * @param spanContext Объект контекста
   * @returns Хедеры в NetsContext
   */
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
