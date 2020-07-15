import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {ISection, TypeSectionWidth, TypeContent} from '@app/models';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-section-editor',
	templateUrl: './section-editor.component.html',
	styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit, OnDestroy {

	@Input() section: ISection;
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	sectionForm: FormGroup;
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	
	subscription: Subscription[] = [];

	get width() {return this.sectionForm.get('width')}
	get type() {return this.sectionForm.get('type')}
	get content() {return this.sectionForm.get('content')}
	get background() {return this.sectionForm.get('background')}
	get backgroundInput() {return this.sectionForm.get('backgroundInput')}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.sectionForm = this.fb.group({
			width: [this.typeWidth.MEDIUM],
			type: [null, Validators.required],
			content: ["", Validators.required],
			seq: [0, Validators.required],
			seqBase: [1, Validators.required],
			background: ["#FFFFFF", Validators.required],
			backgroundInput: ["#FFFFFF", Validators.required]
		});

		const backgroundChange = this.background.valueChanges.subscribe(value => {
			if (this.backgroundInput.value !== value) {
				this.backgroundInput.setValue(value);
			}
		});
		this.subscription.push(backgroundChange);
		const backgroundInputChange = this.backgroundInput.valueChanges.subscribe(value => {
			if (value !== this.background.value) {
				this.background.setValue(value);
			}
		});
		this.subscription.push(backgroundInputChange);

		if (this.section) {
			this.sectionForm.patchValue({
				width: this.section.width,
				type: this.section.type,
				content: this.section.content,
				seq: this.section.seq,
				seqBase: this.section.seqBase,
				background: this.section.background,
				backgroundInput: this.section.background
			});

			if (this.section.imageId != undefined) {
				this.sectionForm.addControl("imageId", this.fb.control(this.section.imageId));
			}
		}
	}

	isTypeNull() {return this.type.value == null}
	isImage() {return this.type.value == this.typeContent.IMAGE || this.type.value == this.typeContent.IMAGE_URL}
	isPost() {return this.type.value == this.typeContent.POST}
	
	isWide() {return this.width.value == this.typeWidth.WIDE}
	isMedium() {return this.width.value == this.typeWidth.MEDIUM}
	isNarrow() {return this.width.value == this.typeWidth.NARROW}

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
		return this.section.width != this.width.value || this.section.type != this.type.value || this.section.content != this.content.value;
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
		});

		this.sectionForm.addControl('imageId', this.fb.control(imageId));
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

	ngOnDestroy() {
		this.subscription.forEach(item => {
			item.unsubscribe();
		});
	}
}
