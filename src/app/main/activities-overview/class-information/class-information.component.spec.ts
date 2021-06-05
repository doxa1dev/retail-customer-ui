import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassInformationComponent } from './class-information.component';

describe('ClassInformationComponent', () => {
  let component: ClassInformationComponent;
  let fixture: ComponentFixture<ClassInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
