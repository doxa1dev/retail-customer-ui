import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepInductionFormThreeComponent } from './naep-induction-form-three.component';

describe('NaepInductionFormThreeComponent', () => {
  let component: NaepInductionFormThreeComponent;
  let fixture: ComponentFixture<NaepInductionFormThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepInductionFormThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepInductionFormThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
