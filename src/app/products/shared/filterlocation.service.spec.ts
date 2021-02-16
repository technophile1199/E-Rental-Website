import { TestBed, inject } from '@angular/core/testing';

import { FilterlocationService } from './filterlocation.service';

describe('FilterlocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterlocationService]
    });
  });

  it('should be created', inject([FilterlocationService], (service: FilterlocationService) => {
    expect(service).toBeTruthy();
  }));
});
