import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentMethodComponent } from './deposit-payment-method.component';

describe('DepositPaymentMethodComponent', () => {
  let component: DepositPaymentMethodComponent;
  let fixture: ComponentFixture<DepositPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
