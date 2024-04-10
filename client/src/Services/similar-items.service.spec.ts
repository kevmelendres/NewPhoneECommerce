import { TestBed } from '@angular/core/testing';

import { SimilarItemsService } from './similar-items.service';

describe('SimilarItemsService', () => {
  let service: SimilarItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
