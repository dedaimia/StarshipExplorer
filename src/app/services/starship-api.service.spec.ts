import { TestBed } from '@angular/core/testing';

import { StarshipApiService } from './starship-api.service';

describe('StarshipApiService', () => {
  let service: StarshipApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarshipApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
