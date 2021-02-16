import { TestBed, inject } from '@angular/core/testing';

import { TamaraproductsServiceService } from './tamaraproducts-service.service';

describe('TamaraproductsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TamaraproductsServiceService]
    });
  });

  it('should be created', inject([TamaraproductsServiceService], (service: TamaraproductsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
