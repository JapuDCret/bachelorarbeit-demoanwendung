import { ExportResult, timeInputToHrTime, hrTimeToTimeStamp } from '@opentelemetry/core';
import { AggregatorKind, HistogramAggregator, LastValueAggregator, MetricExporter, MetricKind, MetricRecord, SumAggregator } from '@opentelemetry/metrics';

import { SplunkEntry, SplunkForwardingService } from 'src/app/shared/splunk-forwarding-svc/splunk-forwarding.service';

export class CustomMetricExporter implements MetricExporter {
    private lastMetricTime = timeInputToHrTime(new Date(1970, 1, 1));

    constructor(private splunkForwardingSvc: SplunkForwardingService) { }

    export(metrics: MetricRecord[], resultCallback: (result: ExportResult) => void): void {
        const metricsToBeExported = [];

        // export metrics only once, by filtering out ones with an older timestamp than the previous newest
        var newestTimestamp = timeInputToHrTime(new Date(1970, 1, 1));
        for (const metric of metrics) {
            const point = metric.aggregator.toPoint();

            if (this.compareHrTime(this.lastMetricTime, point.timestamp) < 0) {
                metricsToBeExported.push(metric);

                if (this.compareHrTime(newestTimestamp, point.timestamp) < 0) {
                    newestTimestamp = point.timestamp;
                }
            }
        }

        if (this.compareHrTime(this.lastMetricTime, newestTimestamp) < 0) {
            this.lastMetricTime = newestTimestamp;
        }

        if (metricsToBeExported.length == 0) {
            return;
        }

        console.debug('export(): converting ' + metricsToBeExported.length + ' metrics');

        const convertedMetrics = this.convertMetrics(metricsToBeExported);

        console.debug('export(): exporting ' + convertedMetrics.length + ' metrics');

        this.splunkForwardingSvc.forwardEvents(convertedMetrics);
    }

    private compareHrTime(a: [number, number], b: [number, number]): number {
        if (a[0] == b[0]) {
            if (a[1] < b[1]) {
                return -1;
            } else if (a[1] < b[1]) {
                return 1;
            } else {
                return 0;
            }
        } else if (a[0] < b[0]) {
            return -1;
        } else {
            return 1;
        }
    }

    private convertMetrics(metrics: MetricRecord[]): SplunkEntry[] {
        const entries = [];

        for (const metric of metrics) {
            var valueObj = {};
            if (metric.aggregator.kind == AggregatorKind.HISTOGRAM) {
                const histogramAgg = metric.aggregator as HistogramAggregator;

                const point = histogramAgg.toPoint();
                const histogram = point.value;
                valueObj = {
                    timestamp: hrTimeToTimeStamp(point.timestamp),
                    count: histogram.count,
                    sum: histogram.sum,
                };
            } else if (metric.aggregator.kind == AggregatorKind.LAST_VALUE) {
                const lastValueAgg = metric.aggregator as LastValueAggregator;

                const point = lastValueAgg.toPoint();
                valueObj = {
                    timestamp: hrTimeToTimeStamp(point.timestamp),
                    value: point.value
                };
            } else if (metric.aggregator.kind == AggregatorKind.SUM) {
                const sumAgg = metric.aggregator as SumAggregator;

                const point = sumAgg.toPoint();
                valueObj = {
                    timestamp: hrTimeToTimeStamp(point.timestamp),
                    value: point.value
                };
            }

            const entry: SplunkEntry = {
                sourcetype: 'metric',
                event: {
                    name: metric.descriptor.name,
                    metricKind: metric.descriptor.metricKind,
                    metricKindResolved: MetricKind[metric.descriptor.metricKind],
                    aggregatorKind: metric.aggregator.kind,
                    aggregatorKindResolved: AggregatorKind[metric.aggregator.kind],
                    description: metric.descriptor.description,
                    valueType: metric.descriptor.valueType,
                    attributes: {
                        ...metric.resource.attributes
                    },
                    labels: {
                        ...metric.labels
                    },
                    ...valueObj
                }
            };

            entries.push(entry);
        }

        return entries;
    }

    shutdown(): Promise<void> {
        return;
    }
}