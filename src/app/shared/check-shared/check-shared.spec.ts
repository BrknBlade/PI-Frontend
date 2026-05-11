import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckShared } from './check-shared';

describe('CheckShared', () => {
  let component: CheckShared;
  let fixture: ComponentFixture<CheckShared>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckShared]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckShared);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
