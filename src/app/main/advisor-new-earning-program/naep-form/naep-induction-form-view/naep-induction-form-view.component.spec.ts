import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepInductionFormViewComponent } from './naep-induction-form-view.component';

describe('NaepInductionFormViewComponent', () => {
  let component: NaepInductionFormViewComponent;
  let fixture: ComponentFixture<NaepInductionFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepInductionFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepInductionFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
