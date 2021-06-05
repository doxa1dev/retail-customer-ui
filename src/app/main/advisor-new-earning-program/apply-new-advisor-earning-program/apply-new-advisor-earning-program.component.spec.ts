import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNewAdvisorEarningProgramComponent } from './apply-new-advisor-earning-program.component';

describe('ApplyNewAdvisorEarningProgramComponent', () => {
  let component: ApplyNewAdvisorEarningProgramComponent;
  let fixture: ComponentFixture<ApplyNewAdvisorEarningProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyNewAdvisorEarningProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNewAdvisorEarningProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
