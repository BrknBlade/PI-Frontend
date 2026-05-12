import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationAdmin } from './navigation-admin';

describe('NavigationAdmin', () => {
  let component: NavigationAdmin;
  let fixture: ComponentFixture<NavigationAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
