import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {ISection, TypeSectionWidth, TypeContent} from '../common';

@Component({
	selector: 'app-section-editor',
	templateUrl: './section-editor.component.html',
	styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit {

	@Input() section: ISection;
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	sectionForm: FormGroup;
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	
	get width() {return this.sectionForm.get('width').value}
	get type() {return this.sectionForm.get('type').value}
	get content() {return this.sectionForm.get('content').value}

	constructor(
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.sectionForm = this.fb.group({
			width: [this.typeWidth.MEDIUM],
			type: [null, Validators.required],
			content: ["", Validators.required],
			seq: [0, Validators.required]
		});

		if (this.section) {
			this.sectionForm.patchValue({
				width: this.section.width,
				type: this.section.type,
				content: this.section.content,
				seq: this.section.seq
			});

			if (this.section.imageId != undefined) {
				this.sectionForm.addControl("imageId", this.fb.control(this.section.imageId));
			}
		}
	}

	isTypeNull() {return this.type == null}
	isImage() {return this.type == this.typeContent.IMAGE || this.type == this.typeContent.IMAGE_URL}
	isPost() {return this.type == this.typeContent.POST}
	
	isWide() {return this.width == this.typeWidth.WIDE}
	isMedium() {return this.width == this.typeWidth.MEDIUM}
	isNarrow() {return this.width == this.typeWidth.NARROW}

	isFormInvalid() {
		return this.sectionForm.invalid;
	}

	spread() {
		if (this.isNarrow()) {
			this.sectionForm.patchValue({
				width: this.typeWidth.MEDIUM
			});
		} else if (this.isMedium()) {
			this.sectionForm.patchValue({
				width: this.typeWidth.WIDE
			});
		}
	}

	shrink() {
		if (this.isWide()) {
			this.sectionForm.patchValue({
				width: this.typeWidth.MEDIUM
			});
		} else if (this.isMedium()) {
			this.sectionForm.patchValue({
				width: this.typeWidth.NARROW
			});
		}
	}

	openImage() {
		this.sectionForm.patchValue({
			type: this.typeContent.IMAGE
		});
	}

	openPost() {
		this.sectionForm.patchValue({
			type: this.typeContent.POST
		});
	}

	backToSelect() {
		this.sectionForm.patchValue({
			type: null,
			content: ""
		});
	}

	isFormModified() {
		return this.section.width != this.width || this.section.type != this.type || this.section.content != this.content;
	}

	imageUrlSubmitted(url) {
		this.sectionForm.patchValue({
			type: this.typeContent.IMAGE_URL,
			content: url
		});
	}

	imageUploaded(e) {
		const {url, imageId} = e;
		this.sectionForm.patchValue({
			type: this.typeContent.IMAGE,
			content: url,
			imageId: imageId
		});
	}

	cancel() {
		if (this.isFormModified) {
			// TODO: ask if is it okay to lose changes
		}
		this.onFinished.emit(false);
	}

	save() {
		this.onFinished.emit(this.sectionForm.getRawValue());
	}
}
