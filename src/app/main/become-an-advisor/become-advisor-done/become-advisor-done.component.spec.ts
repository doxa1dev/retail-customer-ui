import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAdvisorDoneComponent } from './become-advisor-done.component';

describe('BecomeAdvisorDoneComponent', () => {
  let component: BecomeAdvisorDoneComponent;
  let fixture: ComponentFixture<BecomeAdvisorDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAdvisorDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAdvisorDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
