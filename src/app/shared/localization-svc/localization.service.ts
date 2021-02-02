import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import * as api from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/web';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { TraceUtilService } from 'src/app/shared/trace-util/trace-util.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';

export interface Localization {
  "de": {
    [translationKey: string]: string;
  }
}

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
    private traceProvider: WebTracerProvider,
    private traceUtil: TraceUtilService
  ) {
    this.localizationServiceUrl = config.apiEndpoint + LocalizationService.LOCALIZATION_ENDPOINT;
    this.log.info('constructor(): this.localizationServiceUrl = ', this.localizationServiceUrl);
  }

  public getTranslations(): Observable<Localization> {
    this.log.info('getTranslations(): requesting translations');
    
    const tracer = this.traceProvider.getTracer('frontend');
    const span = tracer.startSpan(
      'getTranslations',
      {
        attributes: {
          'sessionId': window.customer.sessionId
        }
      }
    );

    const jaegerTraceHeader = this.traceUtil.serializeSpanContextToJaegerHeader(span.context());

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
          },
          (err) => {
            this.errorHandler.handleError(err, { component: 'LocalizationService' });
  
            span.recordException(err);
          },
          () => {
            span.end();
          }
        ),
        publishReplay(1, 2000),
        refCount(),
      );
  }
}
