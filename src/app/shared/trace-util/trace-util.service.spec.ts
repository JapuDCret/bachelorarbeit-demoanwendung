import { TestBed } from '@angular/core/testing';

import { TraceUtilService } from './trace-util.service';

describe('TraceUtilService', () => {
  let service: TraceUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraceUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
