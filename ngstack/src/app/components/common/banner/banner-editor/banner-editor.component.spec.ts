import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerEditorComponent } from './banner-editor.component';

describe('BannerEditorComponent', () => {
  let component: BannerEditorComponent;
  let fixture: ComponentFixture<BannerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
