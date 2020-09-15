import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditorComponent } from './course-editor.component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';

describe('CourseEditorComponent', () => {
    let component: CourseEditorComponent;
    let fixture: ComponentFixture<CourseEditorComponent>;

    beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				CourseEditorComponent,
				ImageUploadComponent
			],
			imports: [
				ButtonModule,
				ReactiveFormsModule,
				CardModule,
				ColorPickerModule,
				SelectButtonModule,
				InputTextModule,
				InputTextareaModule,
				SliderModule,
				DialogModule,
				PaginatorModule,
				FileUploadModule
			]
		})
		.compileComponents();
    }));

    beforeEach(() => {
		fixture = TestBed.createComponent(CourseEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
    });

    it('should create', () => {
      	expect(component).toBeTruthy();
    });
});
