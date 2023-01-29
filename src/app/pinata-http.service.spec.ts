import { TestBed } from '@angular/core/testing';

import { PinataHTTPService } from './pinata-http.service';

describe('PinataHTTPService', () => {
  let service: PinataHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinataHTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
