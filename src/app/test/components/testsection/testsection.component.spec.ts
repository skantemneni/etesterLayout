import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsectionComponent } from './testsection.component';

describe('TestsectionComponent', () => {
  let component: TestsectionComponent;
  let fixture: ComponentFixture<TestsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
