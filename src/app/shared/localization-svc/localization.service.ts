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
import Localization from 'src/app/shared/localization-svc/localization';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private static readonly LOCALIZATION_ENDPOINT = '/data/translation';

  readonly localizationServiceUrl: string;

  constructor(
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer,
    private traceUtil: TraceUtilService,
    private requestCounter: CounterMetric
  ) {
    this.localizationServiceUrl = config.apiEndpoint + LocalizationService.LOCALIZATION_ENDPOINT;
    this.log.info('constructor(): this.localizationServiceUrl = ', this.localizationServiceUrl);
  }

  public getTranslations(parentSpan?: api.Span): Observable<Localization> {
    this.log.info('getTranslations(): requesting translations');
    
    // start span with provided span as a parent
    const span = this.traceUtil.startChildSpan(this.tracer, 'LocalizationService.getTranslations', parentSpan, { 'shoppingCartId': window.customer.shoppingCartId });

    // generate a jaeger-compatible trace header from OTel span
    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

    // increment the requestCounter metric
    this.requestCounter.add(1, { 'component': 'LocalizationService' });

    return this.http.get<Localization>(
      this.localizationServiceUrl,
      {
        headers: {
          'uber-trace-id': jaegerTraceHeader
        }
      }
    )
      .pipe(
        tap(
          (val) => {
            this.log.info('getTranslations(): returnVal = ', val);

            span.end();
          },
          (err) => {
            this.errorHandler.handleError(err, { component: 'LocalizationService' });

            span.recordException({ code: err.status, name: err.name, message: err.message });
            span.end();
          }
        ),
        publishReplay(1, 2000),
        refCount(),
      );
  }
}
