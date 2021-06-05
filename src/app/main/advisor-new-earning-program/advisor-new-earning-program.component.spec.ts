import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorNewEarningProgramComponent } from './advisor-new-earning-program.component';

describe('AdvisorNewEarningProgramComponent', () => {
  let component: AdvisorNewEarningProgramComponent;
  let fixture: ComponentFixture<AdvisorNewEarningProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisorNewEarningProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorNewEarningProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
