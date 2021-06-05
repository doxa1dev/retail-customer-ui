import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdvisorComponent } from './select-advisor.component';

describe('SelectAdvisorComponent', () => {
  let component: SelectAdvisorComponent;
  let fixture: ComponentFixture<SelectAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
