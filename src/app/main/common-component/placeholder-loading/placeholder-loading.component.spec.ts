import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderLoadingComponent } from './placeholder-loading.component';

describe('PlaceholderLoadingComponent', () => {
  let component: PlaceholderLoadingComponent;
  let fixture: ComponentFixture<PlaceholderLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceholderLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
