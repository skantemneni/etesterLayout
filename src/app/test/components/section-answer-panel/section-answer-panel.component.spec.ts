import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAnswerPanelComponent } from './section-answer-panel.component';

describe('SectionAnswerPanelComponent', () => {
  let component: SectionAnswerPanelComponent;
  let fixture: ComponentFixture<SectionAnswerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAnswerPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAnswerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
