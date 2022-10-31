import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerHtmlRendererComponent } from './inner-html-renderer.component';

describe('InnerHtmlRendererComponent', () => {
  let component: InnerHtmlRendererComponent;
  let fixture: ComponentFixture<InnerHtmlRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerHtmlRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerHtmlRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
