import { TestBed } from '@angular/core/testing';

import { MsgTraceService } from './msg-trace.service';

describe('MsgTraceService', () => {
  let service: MsgTraceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgTraceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
