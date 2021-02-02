import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import * as api from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/web';

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
    private traceProvider: WebTracerProvider,
    private traceUtil: TraceUtilService
  ) {
    this.addressValidationServiceUrl = config.apiEndpoint + AddressValidationService.ADDRESSVALIDATION_ENDPOINT;
    this.log.info('constructor(): this.addressValidationServiceUrl = ', this.addressValidationServiceUrl);
  }

  public validateAddress(address: Address): Observable<void> {
    this.log.info('validateAddress(): validating address, data = ', address);
    
    const tracer = this.traceProvider.getTracer('frontend');
    const span = tracer.startSpan(
      'validateAddress',
      {
        attributes: {
          'sessionId': window.customer.sessionId
        }
      }
    );

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

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
          },
          (err) => {
            this.errorHandler.handleError(err, { component: 'AddressValidationService' });
  
            span.recordException(err);
          },
          () => {
            span.end();
          }
        )
      );
  }
}
