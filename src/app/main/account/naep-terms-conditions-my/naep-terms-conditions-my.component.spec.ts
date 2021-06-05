import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepTermsConditionsMyComponent } from './naep-terms-conditions-my.component';

describe('NaepTermsConditionsMyComponent', () => {
  let component: NaepTermsConditionsMyComponent;
  let fixture: ComponentFixture<NaepTermsConditionsMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepTermsConditionsMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepTermsConditionsMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
