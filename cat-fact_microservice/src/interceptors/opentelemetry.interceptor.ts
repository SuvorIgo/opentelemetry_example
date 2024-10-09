import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { RpcArgumentsHost } from "@nestjs/common/interfaces";
import { NatsContext } from "@nestjs/microservices";
import { MsgHdrsImpl } from "nats";
import { Observable } from "rxjs";

export class OpenTelemetryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const request: RpcArgumentsHost = context.switchToRpc();

        const reqContext: NatsContext = request.getContext();
        const reqBody = request.getData();
        const reqHeaders: MsgHdrsImpl = reqContext.getHeaders();
        console.log(reqHeaders)

        reqBody.spanContext = {
            'x-b3-traceid': reqHeaders.headers.get('x-b3-traceid')[0],
            'x-b3-spanid': reqHeaders.headers.get('x-b3-spanid')[0],
            'x-b3-sampled': reqHeaders.headers.get('x-b3-sampled')[0],
            'uber-trace-id': reqHeaders.headers.get('uber-trace-id')[0],
            'traceparent': reqHeaders.headers.get('traceparent')[0],
            'b3': reqHeaders.headers.get('b3')[0]
        }

        return next.handle();
    }
}