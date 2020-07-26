import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAboutUsEditorInput } from '@app/models';

@Component({
	selector: 'app-about-us-editor',
	templateUrl: './about-us-editor.component.html',
	styleUrls: ['./about-us-editor.component.scss']
})
export class AboutUsEditorComponent implements OnInit {

	@Input() aboutUsData: IAboutUsEditorInput;
	@Output() onFinish: EventEmitter<IAboutUsEditorInput | boolean> = new EventEmitter();
	aboutUsForm: FormGroup;
	isEdit: boolean;

	get aboutUsName() {return this.aboutUsForm.get('aboutUsName');}
	get aboutUsBackground() {return this.aboutUsForm.get('aboutUsBackground');}
	get aboutUsImageId() {return this.aboutUsForm.get('aboutUsImageId');}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.isEdit = false;
		this.aboutUsForm = this.fb.group({
			aboutUsName: ["", Validators.required],
			aboutUsBackground: ["", Validators.required],
			aboutUsImageId: ["", Validators.required]
		});

		console.log(this.aboutUsData)
		if (this.aboutUsData) {
			this.aboutUsForm.patchValue({
				aboutUsName: this.aboutUsData.name,
				aboutUsBackground: this.aboutUsData.background,
				aboutUsImageId: this.aboutUsData.imageId
			});
		}
	}
	
	imageUploaded(e) {
		
	}

	edit() {
		this.isEdit = true;
	}

	save() {
		const formData: IAboutUsEditorInput = {
			name: this.aboutUsName.value,
			background: this.aboutUsBackground.value,
			imageId: this.aboutUsImageId.value
		};
		this.onFinish.emit(formData);
		this.isEdit = false;
	}

	cancel() {
		this.onFinish.emit(false);
		this.isEdit = false;
	}
}
