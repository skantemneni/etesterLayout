import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolygrailflexComponent } from './holygrailflex.component';

describe('HolygrailflexComponent', () => {
  let component: HolygrailflexComponent;
  let fixture: ComponentFixture<HolygrailflexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolygrailflexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolygrailflexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
