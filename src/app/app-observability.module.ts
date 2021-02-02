import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportResult } from '@opentelemetry/core';
import { BatchSpanProcessor, ReadableSpan, SpanExporter, Tracer } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { Meter, MeterProvider } from '@opentelemetry/metrics';

import { CollectorMetricExporter, CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { CollectorExporterConfigBase } from '@opentelemetry/exporter-collector/build/src/types';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { NGXLogger } from 'ngx-logger';

const TRACE_ENDPOINT = '/data/trace';
const METER_ENDPOINT = '/data/meter';

const tracingProviderFactory = (log: NGXLogger, config: AppConfig) => {
  const traceServiceUrl = config.apiEndpoint + TRACE_ENDPOINT;
  
  log.info('tracingProviderFactory(): traceServiceUrl = ', traceServiceUrl);

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

  // provider.register({
  //   contextManager: new ZoneContextManager()
  // })

  return provider.getTracer('frontend');
};

const meterProviderFactory = (log: NGXLogger, config: AppConfig) => {
  const meterServiceUrl = config.apiEndpoint + METER_ENDPOINT;
  
  log.info('meterProviderFactory(): meterServiceUrl = ', meterServiceUrl);

  const metricCollectorOptions: CollectorExporterConfigBase = {
    url: meterServiceUrl,
    headers: {
    },
    serviceName: 'frontend'
  };

  const exporter = new CollectorMetricExporter(metricCollectorOptions);
  
  // Register the exporter
  const provider = new MeterProvider({
    exporter,
    interval: 60000,
  });

  return provider.getMeter('frontend');
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: Tracer,
      useFactory: tracingProviderFactory,
      deps: [ NGXLogger, APP_CONFIG ]
    },
    {
      provide: Meter,
      useFactory: meterProviderFactory,
      deps: [ NGXLogger, APP_CONFIG ]
    }
  ]
})
export class AppObservabilityModule {

  constructor() {
  }
}
