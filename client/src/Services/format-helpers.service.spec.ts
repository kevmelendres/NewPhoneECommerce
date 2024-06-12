import { TestBed } from '@angular/core/testing';

import { FormatHelpersService } from './format-helpers.service';

describe('FormatHelpersService', () => {
  let service: FormatHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
