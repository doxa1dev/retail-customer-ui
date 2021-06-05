import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAttendeeComponent } from './activity-attendee.component';

describe('ActivityAttendeeComponent', () => {
  let component: ActivityAttendeeComponent;
  let fixture: ComponentFixture<ActivityAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
