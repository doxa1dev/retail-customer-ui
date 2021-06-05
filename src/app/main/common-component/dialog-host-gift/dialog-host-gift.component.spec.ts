import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHostGiftComponent } from './dialog-host-gift.component';

describe('DialogHostGiftComponent', () => {
  let component: DialogHostGiftComponent;
  let fixture: ComponentFixture<DialogHostGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHostGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHostGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
