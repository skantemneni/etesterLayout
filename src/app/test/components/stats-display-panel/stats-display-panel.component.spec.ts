import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDisplayPanelComponent } from './stats-display-panel.component';

describe('StatsDisplayPanelComponent', () => {
  let component: StatsDisplayPanelComponent;
  let fixture: ComponentFixture<StatsDisplayPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsDisplayPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsDisplayPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
