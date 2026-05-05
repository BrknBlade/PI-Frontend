import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthAppointment } from './fourth-appointment';

describe('FourthAppointment', () => {
  let component: FourthAppointment;
  let fixture: ComponentFixture<FourthAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
