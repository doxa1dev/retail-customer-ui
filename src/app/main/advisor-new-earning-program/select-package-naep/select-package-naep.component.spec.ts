import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPackageNaepComponent } from './select-package-naep.component';

describe('SelectPackageNaepComponent', () => {
  let component: SelectPackageNaepComponent;
  let fixture: ComponentFixture<SelectPackageNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPackageNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPackageNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
