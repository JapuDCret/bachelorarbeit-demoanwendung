import { TestBed } from '@angular/core/testing';

import { ShoppingCartSvcService } from './shopping-cart-svc.service';

describe('ShoppingCartSvcService', () => {
  let service: ShoppingCartSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
