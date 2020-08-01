import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { IAboutUsEditorInput } from '@app/models';

@Component({
	selector: 'app-about-us-editor',
	templateUrl: './about-us-editor.component.html',
	styleUrls: ['./about-us-editor.component.scss']
})
export class AboutUsEditorComponent implements OnInit, OnChanges {

	@Input() aboutUsData: IAboutUsEditorInput;
	@Input() disabled: boolean;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<IAboutUsEditorInput> = new EventEmitter();
	aboutUsForm: FormGroup;
	isEdit: boolean;
	lock: boolean = false;

	get aboutUsName() {return this.aboutUsForm.get('aboutUsName');}
	get aboutUsBackground() {return this.aboutUsForm.get('aboutUsBackground');}
	get aboutUsImageId() {return this.aboutUsForm.get('aboutUsImageId');}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.isEdit = false;
		this.onEditStateChange.emit(this.isEdit);
		this.aboutUsForm = this.fb.group({
			aboutUsName: ["", Validators.required],
			aboutUsBackground: ["", Validators.required],
			aboutUsImageId: [null, Validators.required]
		});

		if (this.aboutUsData) {
			this.aboutUsForm.patchValue({
				aboutUsName: this.aboutUsData.name,
				aboutUsBackground: this.aboutUsData.background,
				aboutUsImageId: this.aboutUsData.imageId
			});
		}
	}

	ngOnChanges() {
		if (this.disabled != null && this.disabled != undefined) {
			if (this.disabled) {
				this.lock = true;
			} else {
				this.lock = false;
			}
		}
	}
	
	imageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.aboutUsBackground.patchValue(url);
			this.aboutUsImageId.patchValue(imageId);
		}
	}

	isChanged() {
		const {aboutUsName, aboutUsBackground, aboutUsImageId} = this.aboutUsForm.getRawValue();
		return aboutUsName !== this.aboutUsData.name || aboutUsBackground !== this.aboutUsData.background || aboutUsImageId != this.aboutUsData.imageId;
	}

	edit() {
		this.isEdit = true;
		this.onEditStateChange.emit(this.isEdit);
	}

	save() {
		if (this.isChanged()) {
			const formData: IAboutUsEditorInput = {
				name: this.aboutUsName.value,
				background: this.aboutUsBackground.value,
				imageId: this.aboutUsImageId.value
			};
			this.onFinish.emit(formData);
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		} else {
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		}
	}

	cancel() {
		if (this.isChanged()) {
			if (confirm("변경사항을 저장하지 않고 수정을 끝내시겠습니까?")) {
				this.aboutUsForm.patchValue({
					aboutUsName: this.aboutUsData.name,
					aboutUsBackground: this.aboutUsData.background,
					aboutUsImageId: this.aboutUsData.imageId
				});
				this.isEdit = false;
				this.onEditStateChange.emit(this.isEdit);
			}
		} else {
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		}
	}
}
