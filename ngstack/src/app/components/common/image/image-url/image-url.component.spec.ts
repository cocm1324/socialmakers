import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUrlComponent } from './image-url.component';

describe('ImageUrlComponent', () => {
  let component: ImageUrlComponent;
  let fixture: ComponentFixture<ImageUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
