import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import * as api from '@opentelemetry/api';
import { Tracer } from '@opentelemetry/tracing';
import { CounterMetric } from '@opentelemetry/metrics';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { TraceUtilService } from 'src/app/shared/trace-util/trace-util.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';

export interface Address {
  streetName: string;
  streetNumber: number;
  postalCode: number;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressValidationService {

  private static readonly ADDRESSVALIDATION_ENDPOINT = '/data/address-validation';

  readonly addressValidationServiceUrl: string;

  constructor(
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer,
    private traceUtil: TraceUtilService,
    private requestCounter: CounterMetric
  ) {
    this.addressValidationServiceUrl = config.apiEndpoint + AddressValidationService.ADDRESSVALIDATION_ENDPOINT;
    this.log.info('constructor(): this.addressValidationServiceUrl = ', this.addressValidationServiceUrl);
  }

  public validateAddress(address: Address, parentSpan?: api.Span): Observable<void> {
    this.log.info('validateAddress(): validating address, data = ', address);
    
    // start span with provided span as a parent
    const span = this.traceUtil.startChildSpan(this.tracer, 'AddressValidationService.validateAddress', parentSpan, { 'shoppingCartId': window.customer.shoppingCartId });

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

    this.requestCounter.add(1, { 'component': 'AddressValidationService' });

    return this.http.post<void>(
      this.addressValidationServiceUrl,
      address,
      {
        headers: {
          'uber-trace-id': jaegerTraceHeader
        }
      }
    )
      .pipe(
        tap(
          (val) => {
            this.log.info('validateAddress(): returnVal = ', val);

            span.end();
          },
          (err) => {
            const errObject = {
              code: err.status,
              name: err.name,
              message: err.message
            }
            this.errorHandler.handleError(errObject, { component: 'AddressValidationService', description: err.error });

            span.recordException(errObject);
            span.end();
          }
        )
      );
  }
}
