import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorRecruitmentComponent } from './advisor-recruitment.component';

describe('AdvisorRecruitmentComponent', () => {
  let component: AdvisorRecruitmentComponent;
  let fixture: ComponentFixture<AdvisorRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisorRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
