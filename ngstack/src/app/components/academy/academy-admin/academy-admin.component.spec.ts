import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyAdminComponent } from './academy-admin.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { ButtonModule } from 'primeng/button';
import { AcademyAdminRoutingModule } from './academy-admin-routing.module';
import { PanelModule } from 'primeng/panel';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';
import { AboutUsEditorComponent } from './page-editor/about-us-editor/about-us-editor.component';
import { CourseEditorComponent } from './page-editor/course-editor/course-editor.component';
import { NoticeEditorComponent } from './page-editor/notice-editor/notice-editor.component';
import { EditorComponent } from '@components/common/page/editor/editor.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SectionViewerComponent } from '@components/common/page/section-viewer/section-viewer.component';
import { SectionEditorComponent } from '@components/common/page/section-editor/section-editor.component';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageUrlComponent } from '@components/common/image/image-url/image-url.component';
import { EditorModule } from 'primeng/editor';
import { RouterTestingModule } from '@angular/router/testing';

describe('AcademyAdminComponent', () => {
	let component: AcademyAdminComponent;
	let fixture: ComponentFixture<AcademyAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				AcademyAdminComponent,
				AdminMainComponent,
				PageEditorComponent,
				AboutUsEditorComponent,
				CourseEditorComponent,
				NoticeEditorComponent,
				EditorComponent,
				ImageUploadComponent,
				SectionViewerComponent,
				SectionEditorComponent,
				ImageUrlComponent,
				ImageUploadComponent
			],
			imports: [
				AcademyAdminRoutingModule,
				ButtonModule,
				PanelModule,
				OrderListModule,
				TableModule,
				SelectButtonModule,
				SliderModule,
				ColorPickerModule,
				CardModule,
				ReactiveFormsModule,
				InputTextareaModule,
				DialogModule,
				PaginatorModule,
				FileUploadModule,
				EditorModule,
				RouterTestingModule
			]
		}).compileComponents();
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
