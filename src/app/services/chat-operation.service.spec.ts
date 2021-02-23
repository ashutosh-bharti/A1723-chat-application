import { TestBed } from '@angular/core/testing';

import { ChatOperationService } from './chat-operation.service';

describe('ChatService', () => {
  let service: ChatOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
