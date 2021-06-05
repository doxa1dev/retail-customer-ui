import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSpecialComponent } from './dialog-special.component';

describe('DialogSpecialComponent', () => {
  let component: DialogSpecialComponent;
  let fixture: ComponentFixture<DialogSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
