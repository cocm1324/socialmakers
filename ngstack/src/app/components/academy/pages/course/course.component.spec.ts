import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseComponent } from './course.component';
import { ViewerComponent } from '@components/common/page/viewer/viewer.component';
import { SectionViewerComponent } from '@components/common/page/section-viewer/section-viewer.component';

describe('CourseComponent', () => {
	let component: CourseComponent;
	let fixture: ComponentFixture<CourseComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				CourseComponent,
				ViewerComponent,
				SectionViewerComponent
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CourseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
