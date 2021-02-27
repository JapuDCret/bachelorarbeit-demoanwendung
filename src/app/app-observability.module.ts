import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NGXLogger } from 'ngx-logger';

import { BatchSpanProcessor, Tracer } from '@opentelemetry/tracing';
import { WebTracerProvider } from '@opentelemetry/web';
import { CounterMetric, Meter, MeterProvider } from '@opentelemetry/metrics';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { SplunkForwardingService } from 'src/app/shared/splunk-forwarding-svc/splunk-forwarding.service';
import { CustomTraceExporter } from 'src/app/observability/custom-trace-exporter';
import { CustomMetricExporter } from 'src/app/observability/custom-metric-exporter';

const TRACE_ENDPOINT = '/data/trace';

const tracerFactory = (log: NGXLogger, config: AppConfig): Tracer => {
  const traceServiceUrl = config.apiEndpoint + TRACE_ENDPOINT;
  
  log.info('tracerFactory(): traceServiceUrl = ', traceServiceUrl);

  const traceCollectorOptions = {
    url: traceServiceUrl,
    headers: {
    },
    serviceName: 'frontend'
  };

  const exporter = new CustomTraceExporter(traceCollectorOptions);

  // Minimum required setup - supports only synchronous operations
  const provider = new WebTracerProvider({
    plugins: [
      // not currently possible, since they need to be updated
      // new DocumentLoad()
    ],
  });
  
  provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
    // send spans as soon as we have this many
    bufferSize: 10,
    // send spans if we have buffered spans older than this
    bufferTimeout: 500
  }));

  return provider.getTracer('frontend');
};

const meterFactory = (splunkForwardingSvc: SplunkForwardingService): Meter => {
  const exporter = new CustomMetricExporter(splunkForwardingSvc);
  
  // Register the exporter
  const provider = new MeterProvider({
    exporter,
    interval: 10000,
  });

  return provider.getMeter('frontend');
};

const requestCountMetric = (meter: Meter): CounterMetric => {
  return meter.createCounter('requestCount') as CounterMetric;
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: Tracer,
      useFactory: tracerFactory,
      deps: [ NGXLogger, APP_CONFIG ]
    },
    {
      provide: Meter,
      useFactory: meterFactory,
      deps: [ SplunkForwardingService ]
    },
    {
      provide: CounterMetric,
      useFactory: requestCountMetric,
      deps: [ Meter ]
    },
  ]
})
export class AppObservabilityModule {

  constructor() {
  }
}
