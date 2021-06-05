import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDoneComponent } from './verify-done.component';

describe('VerifyDoneComponent', () => {
  let component: VerifyDoneComponent;
  let fixture: ComponentFixture<VerifyDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
