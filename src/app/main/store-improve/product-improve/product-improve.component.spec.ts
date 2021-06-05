import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImproveComponent } from './product-improve.component';

describe('ProductImproveComponent', () => {
  let component: ProductImproveComponent;
  let fixture: ComponentFixture<ProductImproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
