import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsummaryComponent } from './testsummary.component';

describe('TestsummaryComponent', () => {
  let component: TestsummaryComponent;
  let fixture: ComponentFixture<TestsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
