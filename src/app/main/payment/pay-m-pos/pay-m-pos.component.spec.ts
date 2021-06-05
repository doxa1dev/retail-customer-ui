import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMPOSComponent } from './pay-m-pos.component';

describe('PayMPOSComponent', () => {
  let component: PayMPOSComponent;
  let fixture: ComponentFixture<PayMPOSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayMPOSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayMPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
