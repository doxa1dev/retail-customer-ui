import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitNewAdvisorDetailComponent } from './recruit-new-advisor-detail.component';

describe('RecruitNewAdvisorDetailComponent', () => {
  let component: RecruitNewAdvisorDetailComponent;
  let fixture: ComponentFixture<RecruitNewAdvisorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitNewAdvisorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitNewAdvisorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
