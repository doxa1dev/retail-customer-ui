import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepTermsConditionsSgComponent } from './naep-terms-conditions-sg.component';

describe('NaepTermsConditionsSgComponent', () => {
  let component: NaepTermsConditionsSgComponent;
  let fixture: ComponentFixture<NaepTermsConditionsSgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepTermsConditionsSgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepTermsConditionsSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
