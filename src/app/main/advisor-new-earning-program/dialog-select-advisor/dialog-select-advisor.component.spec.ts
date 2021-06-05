import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectAdvisorComponent } from './dialog-select-advisor.component';

describe('DialogSelectAdvisorComponent', () => {
  let component: DialogSelectAdvisorComponent;
  let fixture: ComponentFixture<DialogSelectAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelectAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
