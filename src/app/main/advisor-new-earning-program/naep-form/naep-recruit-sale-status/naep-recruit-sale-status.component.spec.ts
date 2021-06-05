import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepRecruitSaleStatusComponent } from './naep-recruit-sale-status.component';

describe('NaepRecruitSaleStatusComponent', () => {
  let component: NaepRecruitSaleStatusComponent;
  let fixture: ComponentFixture<NaepRecruitSaleStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepRecruitSaleStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepRecruitSaleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
