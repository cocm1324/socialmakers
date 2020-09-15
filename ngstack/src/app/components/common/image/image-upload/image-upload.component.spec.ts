import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadComponent } from './image-upload.component';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DataService } from '@services/data/data.service';
import { HttpClientModule } from '@angular/common/http';

describe('ImageUploadComponent', () => {
	let component: ImageUploadComponent;
	let fixture: ComponentFixture<ImageUploadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				ImageUploadComponent
			],
			imports: [
				DialogModule,
				PaginatorModule,
				FileUploadModule,
				ButtonModule,
				HttpClientModule
			],
			providers: [
				DataService
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImageUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
