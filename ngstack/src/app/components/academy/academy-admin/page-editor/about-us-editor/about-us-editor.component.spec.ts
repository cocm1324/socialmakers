import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsEditorComponent } from './about-us-editor.component';

describe('AboutUsEditorComponent', () => {
  let component: AboutUsEditorComponent;
  let fixture: ComponentFixture<AboutUsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutUsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
