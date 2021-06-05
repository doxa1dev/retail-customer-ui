import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResentEmailComponent } from './resent-email.component';

describe('ResentEmailComponent', () => {
  let component: ResentEmailComponent;
  let fixture: ComponentFixture<ResentEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResentEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResentEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
