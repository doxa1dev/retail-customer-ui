import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRoomBookingComponent } from './pending-room-booking.component';

describe('PendingRoomBookingComponent', () => {
  let component: PendingRoomBookingComponent;
  let fixture: ComponentFixture<PendingRoomBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRoomBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRoomBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
