import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPaymentComponent } from './footer-payment.component';

describe('FooterPaymentComponent', () => {
  let component: FooterPaymentComponent;
  let fixture: ComponentFixture<FooterPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
