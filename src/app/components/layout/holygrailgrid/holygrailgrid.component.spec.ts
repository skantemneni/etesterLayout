import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolygrailComponent } from './holygrail.component';

describe('HolygrailComponent', () => {
  let component: HolygrailComponent;
  let fixture: ComponentFixture<HolygrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolygrailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolygrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
