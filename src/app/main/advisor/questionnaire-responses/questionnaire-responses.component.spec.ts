import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireResponsesComponent } from './questionnaire-responses.component';

describe('QuestionnaireResponsesComponent', () => {
  let component: QuestionnaireResponsesComponent;
  let fixture: ComponentFixture<QuestionnaireResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
