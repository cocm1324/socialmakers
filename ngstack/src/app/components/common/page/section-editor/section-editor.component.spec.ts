import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorComponent } from './section-editor.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUrlComponent } from '@components/common/image/image-url/image-url.component';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { EditorModule } from 'primeng/editor';
import { DataService } from '@services/data/data.service';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';

describe('SectionEditorComponent', () => {
	let component: SectionEditorComponent;
	let fixture: ComponentFixture<SectionEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				SectionEditorComponent,
				ImageUrlComponent,
				ImageUploadComponent
			],
			imports: [
				FormsModule,
				EditorModule,
				ReactiveFormsModule,
				HttpClientModule,
				CardModule,
				ColorPickerModule,
				DialogModule,
				InputTextModule,
				ButtonModule,
				PaginatorModule,
				FileUploadModule
			],
			providers: [
				DataService
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SectionEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
