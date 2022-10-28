import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsegmentComponent } from './testsegment.component';

describe('TestsegmentComponent', () => {
  let component: TestsegmentComponent;
  let fixture: ComponentFixture<TestsegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
