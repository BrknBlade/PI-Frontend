import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstAppointment } from './first-appointment';

describe('FirstAppointment', () => {
  let component: FirstAppointment;
  let fixture: ComponentFixture<FirstAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
