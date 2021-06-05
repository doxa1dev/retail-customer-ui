import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraGiftComponent } from './extra-gift.component';

describe('ExtraGiftComponent', () => {
  let component: ExtraGiftComponent;
  let fixture: ComponentFixture<ExtraGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
