import * as openTelemetry from '@opentelemetry/api';

function recordException(span: openTelemetry.Span, error) {
    span.recordException(error);

    span.setStatus({
        code: openTelemetry.SpanStatusCode.ERROR,
        message: error.message
    })
}

function copyMetadataFromFunctionToFunction(originalFunction, newFunction) {
    Reflect.getMetadataKeys(originalFunction).forEach(metadataKey => {
        Reflect.defineMetadata(metadataKey, Reflect.getMetadata(metadataKey, originalFunction), newFunction);
    })
}

export function OtelSpan(name?, options = {}): MethodDecorator {
    return (target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
        const originalFunction = propertyDescriptor.value;

        propertyDescriptor.value = function (...args) {
            const parentContext: openTelemetry.Context = openTelemetry.propagation.extract(openTelemetry.context.active(), args[0].spanContext)

            const tracer = openTelemetry.trace.getTracer('default');
            const spanName = name || `${target.constructor.name}.${String(propertyKey)}`;

            return tracer.startActiveSpan(spanName, options, parentContext, span => {
                if (originalFunction.constructor.name === 'AsyncFunction') {
                    return (originalFunction
                        .apply(this, args)
                        .catch(error => {
                            recordException(span, error);

                            throw error;
                        })
                    )
                        .finally(() => {
                            span.end();
                        })
                }

                try {
                    return originalFunction.apply(this, args);
                } catch (error) {
                    recordException(span, error);
                } finally {
                    span.end();
                }
            });
        };

        copyMetadataFromFunctionToFunction(originalFunction, propertyDescriptor.value);
    }
}