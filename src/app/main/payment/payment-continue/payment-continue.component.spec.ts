import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentContinueComponent } from './payment-continue.component';

describe('PaymentContinueComponent', () => {
  let component: PaymentContinueComponent;
  let fixture: ComponentFixture<PaymentContinueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentContinueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
