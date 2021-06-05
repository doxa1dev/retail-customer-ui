import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionsFullComponent } from './payment-options-full.component';

describe('PaymentOptionsFullComponent', () => {
  let component: PaymentOptionsFullComponent;
  let fixture: ComponentFixture<PaymentOptionsFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOptionsFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOptionsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
