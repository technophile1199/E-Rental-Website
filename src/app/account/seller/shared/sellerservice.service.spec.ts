import { TestBed, inject } from '@angular/core/testing';

import { SellerserviceService } from './sellerservice.service';

describe('SellerserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerserviceService]
    });
  });

  it('should be created', inject([SellerserviceService], (service: SellerserviceService) => {
    expect(service).toBeTruthy();
  }));
});
