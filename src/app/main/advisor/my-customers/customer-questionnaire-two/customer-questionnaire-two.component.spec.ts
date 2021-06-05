import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuestionnaireTwoComponent } from './customer-questionnaire-two.component';

describe('CustomerQuestionnaireTwoComponent', () => {
  let component: CustomerQuestionnaireTwoComponent;
  let fixture: ComponentFixture<CustomerQuestionnaireTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerQuestionnaireTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuestionnaireTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
