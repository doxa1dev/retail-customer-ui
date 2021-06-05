import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPropertiesProductComponent } from './dialog-properties-product.component';

describe('DialogPropertiesProductComponent', () => {
  let component: DialogPropertiesProductComponent;
  let fixture: ComponentFixture<DialogPropertiesProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPropertiesProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPropertiesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
