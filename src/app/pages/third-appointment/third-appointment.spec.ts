import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdAppointment } from './third-appointment';

describe('ThirdAppointment', () => {
  let component: ThirdAppointment;
  let fixture: ComponentFixture<ThirdAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
