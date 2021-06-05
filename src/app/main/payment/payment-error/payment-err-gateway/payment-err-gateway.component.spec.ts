import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrGatewayComponent } from './payment-err-gateway.component';

describe('PaymentErrGatewayComponent', () => {
  let component: PaymentErrGatewayComponent;
  let fixture: ComponentFixture<PaymentErrGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentErrGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentErrGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
