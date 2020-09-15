import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsEditorComponent } from './about-us-editor.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ImageUploadComponent } from '@components/common/image/image-upload/image-upload.component';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';

describe('AboutUsEditorComponent', () => {
	let component: AboutUsEditorComponent;
	let fixture: ComponentFixture<AboutUsEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AboutUsEditorComponent,
				ImageUploadComponent
			],
			imports: [
				ButtonModule,
				CardModule,
				SelectButtonModule,
				ColorPickerModule,
				SliderModule,
				InputTextModule,
				DialogModule,
				PaginatorModule,
				FileUploadModule,
				ReactiveFormsModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AboutUsEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
