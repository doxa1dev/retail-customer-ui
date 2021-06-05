import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayByChequeComponent } from './pay-by-cheque.component';

describe('PayByChequeComponent', () => {
  let component: PayByChequeComponent;
  let fixture: ComponentFixture<PayByChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayByChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayByChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
