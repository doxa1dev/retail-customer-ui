import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustHostComponent } from './just-host.component';

describe('JustHostComponent', () => {
  let component: JustHostComponent;
  let fixture: ComponentFixture<JustHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JustHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
