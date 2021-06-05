import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreImproveComponent } from './store-improve.component';

describe('StoreImproveComponent', () => {
  let component: StoreImproveComponent;
  let fixture: ComponentFixture<StoreImproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreImproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreImproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
