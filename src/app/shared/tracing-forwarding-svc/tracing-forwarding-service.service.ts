import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { AppConfig } from 'src/app/app-config-module';

@Injectable({
  providedIn: 'root'
})
export class TracingForwardingServiceService {

  private static readonly TRACE_ENDPOINT = '/data/trace';

  private traceServiceUrl: string;

  constructor(
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(AppConfig) config: AppConfig
  ) {
    this.traceServiceUrl = config.apiEndpoint + TracingForwardingServiceService.TRACE_ENDPOINT;
    this.log.info('constructor(): this.traceServiceUrl = ', this.traceServiceUrl);
  }

  /**
   * @param trace
   */
  public forwardTrace(trace: any): void {
    // do not use the logger here, or a it'll trigger a recursion
    console.log('TracingForwardingServiceService.forwardTrace(): trace = ', trace);

    this.http.post<void>(this.traceServiceUrl, trace).subscribe();
  }
}
