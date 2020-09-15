import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditorComponent } from './page-editor.component';
import { CourseEditorComponent } from './course-editor/course-editor.component';
import { AboutUsEditorComponent } from './about-us-editor/about-us-editor.component';
import { NoticeEditorComponent } from './notice-editor/notice-editor.component';
import { EditorComponent } from '@components/common/page/editor/editor.component';
import { DataService } from '@services/data/data.service';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { ImageUrlComponent } from '@components/common/image/image-url/image-url.component';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { SectionEditorComponent } from '@components/common/page/section-editor/section-editor.component';
import { SectionViewerComponent } from '@components/common/page/section-viewer/section-viewer.component';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { HttpClientModule } from '@angular/common/http';

describe('PageEditorComponent', () => {
	let component: PageEditorComponent;
	let fixture: ComponentFixture<PageEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				PageEditorComponent,
				CourseEditorComponent,
				AboutUsEditorComponent,
				NoticeEditorComponent,
				EditorComponent,
				ImageUploadComponent,
				ImageUrlComponent,
				SectionEditorComponent,
				SectionViewerComponent
			],
			providers: [
				DataService
			],
			imports: [
				SliderModule,
				SelectButtonModule,
				ColorPickerModule,
				CardModule,
				ReactiveFormsModule,
				RouterTestingModule,
				InputTextareaModule,
				ButtonModule,
				DialogModule,
				PaginatorModule,
				FileUploadModule,
				EditorModule,
				HttpClientModule
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
