import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHeaderComponent } from './test-header.component';

describe('TestHeaderComponent', () => {
  let component: TestHeaderComponent;
  let fixture: ComponentFixture<TestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
