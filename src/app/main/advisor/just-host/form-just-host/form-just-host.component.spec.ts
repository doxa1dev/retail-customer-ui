import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormJustHostComponent } from './form-just-host.component';

describe('FormJustHostComponent', () => {
  let component: FormJustHostComponent;
  let fixture: ComponentFixture<FormJustHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormJustHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormJustHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
