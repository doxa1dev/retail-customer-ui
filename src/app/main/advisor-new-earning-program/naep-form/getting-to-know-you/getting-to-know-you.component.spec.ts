import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingToKnowYouComponent } from './getting-to-know-you.component';

describe('GettingToKnowYouComponent', () => {
  let component: GettingToKnowYouComponent;
  let fixture: ComponentFixture<GettingToKnowYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingToKnowYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingToKnowYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
