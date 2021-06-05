import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePaymentStatusComponent } from './online-payment-status.component';

describe('OnlinePaymentStatusComponent', () => {
  let component: OnlinePaymentStatusComponent;
  let fixture: ComponentFixture<OnlinePaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
