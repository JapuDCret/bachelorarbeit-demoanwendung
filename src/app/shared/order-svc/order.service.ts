import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import * as api from '@opentelemetry/api';
import { Tracer } from '@opentelemetry/tracing';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { TraceUtilService } from 'src/app/shared/trace-util/trace-util.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';

export interface Order {
  shoppingCartId: string;
  billingAddress: {
    salutation: string;
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
    email: string;
  };
  shippingData: {
    salutation: string;
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
  };
  paymentData: {
    rechnungData: null | {};
    lastschriftData: null | {
      inhaber: string;
      iban: string;
    };
    paypalData: null | {
      email: string
    };
    kreditkartenData: null | {
      inhaber: string;
      nummer: string;
      cvcCode: string;
      gueltigBisMonat: string;
      gueltigBisJahr: string;
    }
  }
}

export interface Receipt {
  itemCount: number;
  orderId: number;
  paymentType: string;
  shippingData: {
    salutation: string,
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
  },
  total: number;
}

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
    private traceUtil: TraceUtilService
  ) {
    this.orderServiceUrl = config.apiEndpoint + OrderService.ORDER_ENDPOINT;
    this.log.info('constructor(): this.orderServiceUrl = ', this.orderServiceUrl);
  }

  private lastResponse: Observable<Receipt>;

  public order(order: Order, parentSpan?: api.Span): Observable<Receipt> {
    this.log.info('order(): placing order, data = ', order);
    
    const span = this.tracer.startSpan(
      'OrderService.order',
      {
        attributes: {
          'sessionId': window.customer.sessionId
        }
      },
      parentSpan && api.setSpan(api.context.active(), parentSpan)
    );

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

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
