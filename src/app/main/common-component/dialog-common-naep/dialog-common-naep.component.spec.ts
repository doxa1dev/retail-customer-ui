import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommonNaepComponent } from './dialog-common-naep.component';

describe('DialogCommonNaepComponent', () => {
  let component: DialogCommonNaepComponent;
  let fixture: ComponentFixture<DialogCommonNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCommonNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCommonNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
