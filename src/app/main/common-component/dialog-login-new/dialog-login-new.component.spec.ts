import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoginNewComponent } from './dialog-login-new.component';

describe('DialogLoginNewComponent', () => {
  let component: DialogLoginNewComponent;
  let fixture: ComponentFixture<DialogLoginNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLoginNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLoginNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
