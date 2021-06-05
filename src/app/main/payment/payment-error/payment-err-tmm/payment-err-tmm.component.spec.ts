import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrTMMComponent } from './payment-err-tmm.component';

describe('PaymentErrTMMComponent', () => {
  let component: PaymentErrTMMComponent;
  let fixture: ComponentFixture<PaymentErrTMMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentErrTMMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentErrTMMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
