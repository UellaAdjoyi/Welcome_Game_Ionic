import { TestBed } from '@angular/core/testing';

import { LeadearBoardService } from './leadear-board.service';

describe('LeadearBoardService', () => {
  let service: LeadearBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadearBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
