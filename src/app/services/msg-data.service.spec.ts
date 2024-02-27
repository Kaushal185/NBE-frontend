import { TestBed } from '@angular/core/testing';

import { MsgDataService } from './msg-data.service';

describe('MsgDataService', () => {
  let service: MsgDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
