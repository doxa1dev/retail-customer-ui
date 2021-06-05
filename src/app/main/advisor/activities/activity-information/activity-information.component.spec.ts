import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInformationComponent } from './activity-information.component';

describe('ActivityInformationComponent', () => {
  let component: ActivityInformationComponent;
  let fixture: ComponentFixture<ActivityInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
