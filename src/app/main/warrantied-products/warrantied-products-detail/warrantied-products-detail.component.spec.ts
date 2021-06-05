import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantiedProductsDetailComponent } from './warrantied-products-detail.component';

describe('WarrantiedProductsDetailComponent', () => {
  let component: WarrantiedProductsDetailComponent;
  let fixture: ComponentFixture<WarrantiedProductsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantiedProductsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantiedProductsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
