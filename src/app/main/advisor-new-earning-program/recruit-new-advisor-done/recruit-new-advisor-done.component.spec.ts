import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitNewAdvisorDoneComponent } from './recruit-new-advisor-done.component';

describe('RecruitNewAdvisorDoneComponent', () => {
  let component: RecruitNewAdvisorDoneComponent;
  let fixture: ComponentFixture<RecruitNewAdvisorDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitNewAdvisorDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitNewAdvisorDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
