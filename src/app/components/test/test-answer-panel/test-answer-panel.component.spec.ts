import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAnswerPanelComponent } from './test-answer-panel.component';

describe('TestAnswerPanelComponent', () => {
  let component: TestAnswerPanelComponent;
  let fixture: ComponentFixture<TestAnswerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAnswerPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAnswerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
