import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondAppointment } from './second-appointment';

describe('SecondAppointment', () => {
  let component: SecondAppointment;
  let fixture: ComponentFixture<SecondAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
