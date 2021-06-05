import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTermAndConditionComponent } from './purchase-term-and-condition.component';

describe('PurchaseTermAndConditionComponent', () => {
  let component: PurchaseTermAndConditionComponent;
  let fixture: ComponentFixture<PurchaseTermAndConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTermAndConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTermAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
