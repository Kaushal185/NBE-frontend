import { TestBed } from '@angular/core/testing';

import { SwiftMsgService } from './swift-msg.service';

describe('SwiftMsgService', () => {
  let service: SwiftMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwiftMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
