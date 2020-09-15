import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerComponent } from './viewer.component';
import { SectionViewerComponent } from '../section-viewer/section-viewer.component';

describe('ViewerComponent', () => {
	let component: ViewerComponent;
	let fixture: ComponentFixture<ViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				ViewerComponent,
				SectionViewerComponent
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
