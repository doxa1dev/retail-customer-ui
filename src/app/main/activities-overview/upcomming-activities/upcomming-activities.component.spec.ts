import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingActivitiesComponent } from './upcomming-activities.component';

describe('UpcommingActivitiesComponent', () => {
  let component: UpcommingActivitiesComponent;
  let fixture: ComponentFixture<UpcommingActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcommingActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcommingActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
