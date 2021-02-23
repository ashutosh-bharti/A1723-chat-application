import { TestBed } from '@angular/core/testing';

import { AuthenticService } from './authentic.service';

describe('AuthenticService', () => {
  let service: AuthenticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
