import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPayComponent } from './footer-pay.component';

describe('FooterPayComponent', () => {
  let component: FooterPayComponent;
  let fixture: ComponentFixture<FooterPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
