import { TestBed } from '@angular/core/testing';
import { CutData } from './cut-data';


describe('CutData', () => {
  let service: CutData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CutData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
