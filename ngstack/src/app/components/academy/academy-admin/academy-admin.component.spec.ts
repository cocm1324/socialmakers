import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyAdminComponent } from './academy-admin.component';

describe('AcademyAdminComponent', () => {
  let component: AcademyAdminComponent;
  let fixture: ComponentFixture<AcademyAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademyAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
