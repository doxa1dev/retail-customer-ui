import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGiftComponent } from './host-gift.component';

describe('HostGiftComponent', () => {
  let component: HostGiftComponent;
  let fixture: ComponentFixture<HostGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
