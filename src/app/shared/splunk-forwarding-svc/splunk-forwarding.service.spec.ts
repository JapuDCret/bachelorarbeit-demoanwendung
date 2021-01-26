import { TestBed } from '@angular/core/testing';

import { SplunkForwardingService } from './splunk-forwarding.service';

describe('SplunkForwardingService', () => {
  let service: SplunkForwardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplunkForwardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
