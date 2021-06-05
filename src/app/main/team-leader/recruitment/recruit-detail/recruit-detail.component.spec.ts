import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitDetailComponent } from './recruit-detail.component';

describe('RecruitDetailComponent', () => {
  let component: RecruitDetailComponent;
  let fixture: ComponentFixture<RecruitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
