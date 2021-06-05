import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPackageNaepImproveComponent } from './buy-package-naep-improve.component';

describe('BuyPackageNaepImproveComponent', () => {
  let component: BuyPackageNaepImproveComponent;
  let fixture: ComponentFixture<BuyPackageNaepImproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPackageNaepImproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPackageNaepImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
