import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutImproveComponent } from './check-out-improve.component';

describe('CheckOutImproveComponent', () => {
  let component: CheckOutImproveComponent;
  let fixture: ComponentFixture<CheckOutImproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutImproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
