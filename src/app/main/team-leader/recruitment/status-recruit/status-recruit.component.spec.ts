import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusRecruitComponent } from './status-recruit.component';

describe('StatusRecruitComponent', () => {
  let component: StatusRecruitComponent;
  let fixture: ComponentFixture<StatusRecruitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusRecruitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusRecruitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
