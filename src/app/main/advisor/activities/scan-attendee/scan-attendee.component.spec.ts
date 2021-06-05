import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanAttendeeComponent } from './scan-attendee.component';

describe('ScanAttendeeComponent', () => {
  let component: ScanAttendeeComponent;
  let fixture: ComponentFixture<ScanAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
