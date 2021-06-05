import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentConfirmComponent } from './installment-confirm.component';

describe('InstallmentConfirmComponent', () => {
  let component: InstallmentConfirmComponent;
  let fixture: ComponentFixture<InstallmentConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallmentConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
