import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEppComponent } from './pay-epp.component';

describe('PayEppComponent', () => {
  let component: PayEppComponent;
  let fixture: ComponentFixture<PayEppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayEppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayEppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
