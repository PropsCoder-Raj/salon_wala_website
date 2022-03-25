import { TestBed } from '@angular/core/testing';

import { ServiceCartsService } from './service-carts.service';

describe('ServiceCartsService', () => {
  let service: ServiceCartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
