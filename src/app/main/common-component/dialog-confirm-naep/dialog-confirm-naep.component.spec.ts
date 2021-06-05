import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmNaepComponent } from './dialog-confirm-naep.component';

describe('DialogConfirmNaepComponent', () => {
  let component: DialogConfirmNaepComponent;
  let fixture: ComponentFixture<DialogConfirmNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
