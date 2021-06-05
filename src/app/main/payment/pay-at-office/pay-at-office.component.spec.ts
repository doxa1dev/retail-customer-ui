import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAtOfficeComponent } from './pay-at-office.component';

describe('PayAtOfficeComponent', () => {
  let component: PayAtOfficeComponent;
  let fixture: ComponentFixture<PayAtOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayAtOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayAtOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
