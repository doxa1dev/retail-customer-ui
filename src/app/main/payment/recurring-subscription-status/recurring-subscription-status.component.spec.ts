import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringSubscriptionStatusComponent } from './recurring-subscription-status.component';

describe('RecurringSubscriptionStatusComponent', () => {
  let component: RecurringSubscriptionStatusComponent;
  let fixture: ComponentFixture<RecurringSubscriptionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringSubscriptionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringSubscriptionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
