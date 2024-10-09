import * as process from 'process';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export const OtelNodeSDK = new NodeSDK({
    serviceName: 'API-GATEWAY',
    spanProcessors: [
        new BatchSpanProcessor(
            new OTLPTraceExporter({
                url: 'http://localhost:4318/v1/traces'
            })
        )
    ],
    textMapPropagator: new CompositePropagator({
        propagators: [
            new JaegerPropagator(),
            new W3CTraceContextPropagator(),
            new W3CBaggagePropagator(),
            new B3Propagator(),
            new B3Propagator({
                injectEncoding: B3InjectEncoding.MULTI_HEADER
            })
        ]
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-amqplib': { enabled: false },
            '@opentelemetry/instrumentation-aws-lambda': { enabled: false },
            '@opentelemetry/instrumentation-aws-sdk': { enabled: false },
            '@opentelemetry/instrumentation-bunyan': { enabled: false },
            '@opentelemetry/instrumentation-cassandra-driver': { enabled: false },
            '@opentelemetry/instrumentation-cucumber': { enabled: false },
            '@opentelemetry/instrumentation-fastify': { enabled: false },
            '@opentelemetry/instrumentation-fs': { enabled: false },
            '@opentelemetry/instrumentation-generic-pool': { enabled: false },
            '@opentelemetry/instrumentation-graphql': { enabled: false },
            '@opentelemetry/instrumentation-hapi': { enabled: false },
            '@opentelemetry/instrumentation-ioredis': { enabled: false },
            '@opentelemetry/instrumentation-kafkajs': { enabled: false },
            '@opentelemetry/instrumentation-knex': { enabled: false },
            '@opentelemetry/instrumentation-koa': { enabled: false },
            '@opentelemetry/instrumentation-lru-memoizer': { enabled: false },
            '@opentelemetry/instrumentation-memcached': { enabled: false },
            '@opentelemetry/instrumentation-mysql2': { enabled: false },
            '@opentelemetry/instrumentation-mysql': { enabled: false },
            '@opentelemetry/instrumentation-pino': { enabled: false },
            '@opentelemetry/instrumentation-redis': { enabled: false },
            '@opentelemetry/instrumentation-redis-4': { enabled: false },
            '@opentelemetry/instrumentation-restify': { enabled: false },
            '@opentelemetry/instrumentation-socket.io': { enabled: false },
            '@opentelemetry/instrumentation-tedious': { enabled: false },
            '@opentelemetry/instrumentation-winston': { enabled: false }
        })
    ]
});

process.on('SIGTERM', () => {
    OtelNodeSDK
        .shutdown()
        .then(
            () => console.log('SDK shit down successfully'),
            (err) => console.log('Error shutting down SDK', err),
        )
        .finally(() => process.exit(0));
});