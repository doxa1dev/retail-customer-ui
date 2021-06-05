import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitNewAdvisorComponent } from './recruit-new-advisor.component';

describe('RecruitNewAdvisorComponent', () => {
  let component: RecruitNewAdvisorComponent;
  let fixture: ComponentFixture<RecruitNewAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitNewAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitNewAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
