import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineEppComponent } from './offline-epp.component';

describe('OfflineEppComponent', () => {
  let component: OfflineEppComponent;
  let fixture: ComponentFixture<OfflineEppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineEppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineEppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
