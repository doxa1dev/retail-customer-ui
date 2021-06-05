import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantiedComponent } from './warrantied.component';

describe('WarrantiedComponent', () => {
  let component: WarrantiedComponent;
  let fixture: ComponentFixture<WarrantiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
