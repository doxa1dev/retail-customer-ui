import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBookingDetailComponent } from './room-booking-detail.component';

describe('RoomBookingDetailComponent', () => {
  let component: RoomBookingDetailComponent;
  let fixture: ComponentFixture<RoomBookingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomBookingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomBookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
