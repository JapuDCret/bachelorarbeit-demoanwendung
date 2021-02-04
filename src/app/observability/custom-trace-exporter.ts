import { ExportResult } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/tracing';
import { CollectorExporterNodeConfigBase, CollectorTraceExporter } from '@opentelemetry/exporter-collector';

export class CustomTraceExporter implements SpanExporter {
    private traceExporter: CollectorTraceExporter;

    constructor(traceCollectorOptions: CollectorExporterNodeConfigBase) {
        this.traceExporter = new CollectorTraceExporter(traceCollectorOptions);
    }

    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
        for (const span of spans) {
            span.attributes['currentTime'] = new Date().getTime();
        }

        return this.traceExporter.export(spans, resultCallback);
    }

    shutdown(): Promise<void> {
        return this.traceExporter.shutdown();
    }
}