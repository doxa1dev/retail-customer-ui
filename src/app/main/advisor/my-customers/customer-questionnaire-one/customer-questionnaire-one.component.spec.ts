import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuestionnaireOneComponent } from './customer-questionnaire-one.component';

describe('CustomerQuestionnaireOneComponent', () => {
  let component: CustomerQuestionnaireOneComponent;
  let fixture: ComponentFixture<CustomerQuestionnaireOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerQuestionnaireOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuestionnaireOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
