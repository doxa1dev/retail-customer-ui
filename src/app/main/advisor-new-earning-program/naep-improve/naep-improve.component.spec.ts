import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepImproveComponent } from './naep-improve.component';

describe('NaepImproveComponent', () => {
  let component: NaepImproveComponent;
  let fixture: ComponentFixture<NaepImproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepImproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
