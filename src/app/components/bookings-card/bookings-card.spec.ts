import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsCard } from './bookings-card';

describe('BookingsCard', () => {
  let component: BookingsCard;
  let fixture: ComponentFixture<BookingsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
