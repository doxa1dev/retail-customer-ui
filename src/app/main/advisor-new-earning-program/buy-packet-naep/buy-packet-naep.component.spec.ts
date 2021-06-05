import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPacketNaepComponent } from './buy-packet-naep.component';

describe('BuyPacketNaepComponent', () => {
  let component: BuyPacketNaepComponent;
  let fixture: ComponentFixture<BuyPacketNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPacketNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPacketNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
