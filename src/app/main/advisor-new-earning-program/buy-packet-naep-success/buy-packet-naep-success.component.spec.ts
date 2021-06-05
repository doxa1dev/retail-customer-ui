import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPacketNaepSuccessComponent } from './buy-packet-naep-success.component';

describe('BuyPacketNaepSuccessComponent', () => {
  let component: BuyPacketNaepSuccessComponent;
  let fixture: ComponentFixture<BuyPacketNaepSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPacketNaepSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPacketNaepSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
