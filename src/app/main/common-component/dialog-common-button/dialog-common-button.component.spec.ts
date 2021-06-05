import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommonButtonComponent } from './dialog-common-button.component';

describe('DialogCommonButtonComponent', () => {
  let component: DialogCommonButtonComponent;
  let fixture: ComponentFixture<DialogCommonButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCommonButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCommonButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
