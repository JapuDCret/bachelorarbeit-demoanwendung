import { Injectable } from '@angular/core';

import * as api from '@opentelemetry/api';

@Injectable({
  providedIn: 'root'
})
export class TraceUtilService {

  constructor() { }

  /**
   * Propagates {@link SpanContext} through Trace Context format propagation.
   * {trace-id}:{span-id}:{parent-span-id}:{flags}
   * {trace-id}
   * 64-bit or 128-bit random number in base16 format.
   * Can be variable length, shorter values are 0-padded on the left.
   * Value of 0 is invalid.
   * {span-id}
   * 64-bit random number in base16 format.
   * {parent-span-id}
   * Set to 0 because this field is deprecated.
   * {flags}
   * One byte bitmap, as two hex digits.
   * Inspired by jaeger-client-node project.
   */
  public serializeSpanContextToJaegerHeader(spanContext: api.SpanContext): string {
    const traceFlags = `0${(spanContext.traceFlags || api.TraceFlags.NONE).toString(16)}`;
  
    return `${spanContext.traceId}:${spanContext.spanId}:0:${traceFlags}`;
  }
}
