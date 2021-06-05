import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepInductionFormOneComponent } from './naep-induction-form-one.component';

describe('NaepInductionFormOneComponent', () => {
  let component: NaepInductionFormOneComponent;
  let fixture: ComponentFixture<NaepInductionFormOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepInductionFormOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepInductionFormOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
