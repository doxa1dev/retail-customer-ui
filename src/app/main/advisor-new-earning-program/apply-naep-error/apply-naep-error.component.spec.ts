import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNaepErrorComponent } from './apply-naep-error.component';

describe('ApplyNaepErrorComponent', () => {
  let component: ApplyNaepErrorComponent;
  let fixture: ComponentFixture<ApplyNaepErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyNaepErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNaepErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
