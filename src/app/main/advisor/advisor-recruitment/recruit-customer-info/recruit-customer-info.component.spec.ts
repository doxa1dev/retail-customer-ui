import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitCustomerInfoComponent } from './recruit-customer-info.component';

describe('RecruitCustomerInfoComponent', () => {
  let component: RecruitCustomerInfoComponent;
  let fixture: ComponentFixture<RecruitCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
