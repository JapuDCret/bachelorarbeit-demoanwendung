import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchSpanProcessor, ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';

import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { CollectorExporterConfigBase } from '@opentelemetry/exporter-collector/build/src/types';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { NGXLogger } from 'ngx-logger';
import { ExportResult } from '@opentelemetry/core';

const TRACE_ENDPOINT = '/data/trace';

const providerFactory = (log: NGXLogger, config: AppConfig) => {
  const traceServiceUrl = config.apiEndpoint + TRACE_ENDPOINT;
  
  log.info('providerFactory(): traceServiceUrl = ', traceServiceUrl);

  const traceCollectorOptions: CollectorExporterConfigBase = {
    url: traceServiceUrl,
    headers: {
    },
    serviceName: 'frontend'
  };

  class CustomTraceExporter implements SpanExporter {
    private traceExporter: CollectorTraceExporter;

    constructor(traceCollectorOptions) {
      this.traceExporter = new CollectorTraceExporter(traceCollectorOptions);
    }

    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
      for(var i=0; i < spans.length; i++) {
        spans[i].attributes['currentTime'] = new Date().getTime();
      }

      return this.traceExporter.export(spans, resultCallback);
    }

    shutdown(): Promise<void> {
      return this.traceExporter.shutdown();
    }
  }

  const exporter = new CustomTraceExporter(traceCollectorOptions);

  // Minimum required setup - supports only synchronous operations
  const provider = new WebTracerProvider({
    plugins: [
      // not currently possible, since they need to be updated
      // new DocumentLoad()
    ],
  });
  
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
    // send spans as soon as we have this many
    bufferSize: 10,
    // send spans if we have buffered spans older than this
    bufferTimeout: 500
  }));

  provider.register({
    contextManager: new ZoneContextManager()
  })

  return provider;
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: WebTracerProvider,
      useFactory: providerFactory,
      deps: [ NGXLogger, APP_CONFIG ]
    }
  ]
})
export class AppTracingModule {

  constructor() {
  }
}
