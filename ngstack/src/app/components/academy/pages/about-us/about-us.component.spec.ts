import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsComponent } from './about-us.component';
import { ViewerComponent } from '@components/common/page/viewer/viewer.component';
import { SectionViewerComponent } from '@components/common/page/section-viewer/section-viewer.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '@services/data/data.service';

describe('AboutUsComponent', () => {
	let component: AboutUsComponent;
	let fixture: ComponentFixture<AboutUsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				AboutUsComponent,
				ViewerComponent,
				SectionViewerComponent
			],
			imports: [
				HttpClientModule
			],
			providers: [
				DataService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AboutUsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
