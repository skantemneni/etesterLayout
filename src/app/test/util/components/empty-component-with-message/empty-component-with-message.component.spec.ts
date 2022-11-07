import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyComponentWithMessageComponent } from './empty-component-with-message.component';

describe('EmptyComponentWithMessageComponent', () => {
  let component: EmptyComponentWithMessageComponent;
  let fixture: ComponentFixture<EmptyComponentWithMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyComponentWithMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyComponentWithMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
