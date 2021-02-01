import { TestBed } from '@angular/core/testing';

import { TracingForwardingServiceService } from './tracing-forwarding-service.service';

describe('TracingForwardingServiceService', () => {
  let service: TracingForwardingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TracingForwardingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
