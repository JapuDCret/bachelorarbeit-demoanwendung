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

export interface BE_ShoppingCart {
  shoppingCartId: string;
  items: BE_ShoppingCartItem[];
}

export interface BE_ShoppingCartItem {
  id: number;
  translationKey: string;
  price: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private static readonly CART_ENDPOINT = '/data/cart';

  readonly cartServiceUrl: string;

  constructor(
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer,
    private traceUtil: TraceUtilService,
    private requestCounter: CounterMetric
  ) {
    this.cartServiceUrl = config.apiEndpoint + ShoppingCartService.CART_ENDPOINT;
    this.log.info('constructor(): this.cartServiceUrl = ', this.cartServiceUrl);
  }

  public getShoppingCart(shoppingCartId: string, parentSpan?: api.Span): Observable<BE_ShoppingCart> {
    this.log.info('getShoppingCart(): requesting shopping cart with id = ', shoppingCartId);

    // start span with provided span as a parent
    const span = this.traceUtil.startChildSpan(this.tracer, 'ShoppingCartService.getShoppingCart', parentSpan, { 'shoppingCartId': window.customer.shoppingCartId });

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

    this.requestCounter.add(1, { 'component': 'ShoppingCartService' });

    return this.http.get<BE_ShoppingCart>(
      this.cartServiceUrl + '/' + shoppingCartId,
      {
        headers: {
          'uber-trace-id': jaegerTraceHeader
        }
      }
    )
    .pipe(
      tap(
        (val) => {
          this.log.info('getShoppingCart(): returnVal = ', val);

          span.addEvent('shoppingCart', {
            length: val.items.length,
            shoppingCartId: val.shoppingCartId,
          });
          span.end();
        },
        (err) => {
          this.errorHandler.handleError(err, { component: 'ShoppingCartService' });

          span.recordException(err);
          span.end();
        }
      ),
      publishReplay(1, 2000),
      refCount(),
    );
  }
}
