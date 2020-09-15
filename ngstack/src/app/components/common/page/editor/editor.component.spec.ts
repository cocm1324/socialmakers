import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { SectionViewerComponent } from '../section-viewer/section-viewer.component';
import { SectionEditorComponent } from '../section-editor/section-editor.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EditorModule } from 'primeng/editor';
import { ImageUrlComponent } from '@components/common/image/image-url/image-url.component';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';

describe('EditorComponent', () => {
	let component: EditorComponent;
	let fixture: ComponentFixture<EditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				EditorComponent,
				SectionViewerComponent,
				SectionEditorComponent,
				ImageUrlComponent,
				ImageUploadComponent
			],
			imports: [
				ButtonModule,
				CardModule,
				ColorPickerModule,
				EditorModule,
				ReactiveFormsModule,
				DialogModule,
				FormsModule,
				PaginatorModule,
				FileUploadModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
