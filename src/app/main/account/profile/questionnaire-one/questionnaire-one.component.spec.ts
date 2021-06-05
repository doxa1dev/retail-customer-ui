import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireOneComponent } from './questionnaire-one.component';

describe('QuestionnaireOneComponent', () => {
  let component: QuestionnaireOneComponent;
  let fixture: ComponentFixture<QuestionnaireOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
