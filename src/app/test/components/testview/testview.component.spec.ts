import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestviewComponent } from './testview.component';

describe('TestviewComponent', () => {
  let component: TestviewComponent;
  let fixture: ComponentFixture<TestviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
