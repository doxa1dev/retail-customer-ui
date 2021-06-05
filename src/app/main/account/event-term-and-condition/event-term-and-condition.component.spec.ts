import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTermAndConditionComponent } from './event-term-and-condition.component';

describe('EventTermAndConditionComponent', () => {
  let component: EventTermAndConditionComponent;
  let fixture: ComponentFixture<EventTermAndConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTermAndConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTermAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
