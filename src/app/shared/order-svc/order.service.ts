import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import * as api from '@opentelemetry/api';
import { Tracer } from '@opentelemetry/tracing';
import { CounterMetric } from '@opentelemetry/metrics';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { TraceUtilService } from 'src/app/shared/trace-util/trace-util.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';
import Receipt from 'src/app/shared/order-svc/receipt';
import Order from 'src/app/shared/order-svc/order';

export {
  Receipt,
  Order,
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private static readonly ORDER_ENDPOINT = '/data/order';

  readonly orderServiceUrl: string;

  constructor(
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer,
    private traceUtil: TraceUtilService,
    private requestCounter: CounterMetric
  ) {
    this.orderServiceUrl = config.apiEndpoint + OrderService.ORDER_ENDPOINT;
    this.log.info('constructor(): this.orderServiceUrl = ', this.orderServiceUrl);
  }

  private lastResponse: Observable<Receipt>;

  public order(order: Order, parentSpan?: api.Span): Observable<Receipt> {
    this.log.info('order(): placing order, data = ', order);
    
    // start span with provided span as a parent
    const span = this.traceUtil.startChildSpan(this.tracer, 'OrderService.order', parentSpan, { 'shoppingCartId': window.customer.shoppingCartId });

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

    this.requestCounter.add(1, { 'component': 'OrderService' });

    this.lastResponse = this.http.post<Receipt>(
      this.orderServiceUrl,
      order,
      {
        headers: {
          'uber-trace-id': jaegerTraceHeader
        }
      }
    )
    .pipe(
      tap(
        (val) => {
          this.log.info('order(): returnVal = ', val);

          span.end();
        },
        (err) => {
          this.errorHandler.handleError(err, { component: 'OrderService' });

          span.recordException({ code: err.status, name: err.name, message: err.message });
          span.end();
        }
      ),
      publishReplay(1, 2000),
      refCount(),
    );

    return this.lastResponse;
  }

  public getLastResponse(): Observable<Receipt> {
    return this.lastResponse;
  }
}
