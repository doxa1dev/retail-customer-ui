import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCopyLinkComponent } from './dialog-copy-link.component';

describe('DialogCopyLinkComponent', () => {
  let component: DialogCopyLinkComponent;
  let fixture: ComponentFixture<DialogCopyLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCopyLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCopyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
