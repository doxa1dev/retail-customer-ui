import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyBoxProductComponent } from './empty-box-product.component';

describe('EmptyBoxProductComponent', () => {
  let component: EmptyBoxProductComponent;
  let fixture: ComponentFixture<EmptyBoxProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyBoxProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyBoxProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
