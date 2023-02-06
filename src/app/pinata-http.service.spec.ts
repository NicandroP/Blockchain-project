import { TestBed } from '@angular/core/testing';

import { PinataHttpService } from './pinata-http.service';

describe('PinataHttpService', () => {
  let service: PinataHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinataHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
