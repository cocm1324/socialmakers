import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeSectionWidth, TypeContent, ISectionWithContentId } from '@app/models';
import { Subscription } from 'rxjs';
import { DataService } from '@services/data/data.service';

@Component({
	selector: 'app-section-editor',
	templateUrl: './section-editor.component.html',
	styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() section: ISectionWithContentId;
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	@ViewChild('image', {static: false}) image: ElementRef;

	sectionForm: FormGroup;
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	eyedrop: boolean;
	subscription: Subscription[] = [];

	get width() {return this.sectionForm.get('width')}
	get type() {return this.sectionForm.get('type')}
	get content() {return this.sectionForm.get('content');}
	get background() {return this.sectionForm.get('background')}
	get backgroundInput() {return this.sectionForm.get('backgroundInput')}
	get imageId() {
		if (this.sectionForm.contains('imageId')) {
			return this.sectionForm.get('imageId');
		} else {
			return undefined;
		}
	}
	get imageUrl() {
		if (this.sectionForm.contains('imageUrl')) {
			return this.sectionForm.get('imageUrl');
		} else {
			return undefined;
		}
	}

	constructor(private fb: FormBuilder, private dataService: DataService) { }

	ngOnInit() {
		this.sectionForm = this.fb.group({
			width: [this.typeWidth.MEDIUM],
			type: [null, Validators.required],
			content: ["", Validators.required],
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
				background: this.section.background,
				backgroundInput: this.section.background
			});

			if (this.section.type = TypeContent.IMAGE) {
				this.goToImageUploadState(this.section.imageId, this.section.imageUrl);
			} else if (this.section.type = TypeContent.IMAGE_URL) {
				this.goToImageUrlState(this.section.content);
			} else {
				this.goToPostState();
			}
		}
		
		this.eyedrop = false;
	}

	ngAfterViewInit() {
		if (this.isTypeNull()) {
			document.body.scrollTop = document.body.scrollHeight;
		}
	}

	goToImageUploadState(imageId, imageUrl) {
		if (this.sectionForm.contains("imageId")) {
			this.imageId.patchValue(imageId);
		} else {
			this.sectionForm.addControl("imageId", this.fb.control(imageId));
		}
		if (this.sectionForm.contains("imageUrl")) {
			this.imageUrl.patchValue(imageUrl);
		} else {
			this.sectionForm.addControl("imageUrl", this.fb.control(imageUrl));
		}

		if (this.content.validator) {
			this.content.clearValidators();
		}
		this.content.patchValue("");

		this.content.updateValueAndValidity();
		this.type.patchValue(TypeContent.IMAGE);
	}

	goToImageUrlState(imageUrl) {
		if (this.sectionForm.contains("imageId")) {
			this.sectionForm.removeControl("imageId");
		} 

		if (this.sectionForm.contains("imageUrl")) {
			this.imageUrl.patchValue(imageUrl);
		} else {
			this.sectionForm.addControl("imageUrl", this.fb.control(imageUrl));
		}

		if (this.content.validator) {
			this.content.clearValidators();
		}
		this.content.patchValue("");

		this.content.updateValueAndValidity();
		this.type.patchValue(TypeContent.IMAGE_URL);
	}

	goToPostState() {
		if (this.sectionForm.contains("imageId")) {
			this.sectionForm.removeControl("imageId");
		} 

		if (this.sectionForm.contains("imageUrl")) {
			this.sectionForm.removeControl("imageUrl");
		}

		if (!this.content.validator) {
			this.content.setValidators(Validators.required);
		}

		this.content.updateValueAndValidity();
		this.type.patchValue(TypeContent.POST);
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
		this.goToImageUrlState("");
	}

	openPost() {
		this.goToPostState();
	}

	backToSelect() {
		this.sectionForm.patchValue({
			type: null,
			content: ""
		});
	}

	isFormModified() {
		const {width, type, content, background} = this.sectionForm.getRawValue();

		if (this.section) {
			return this.section.width != width
				|| this.section.type != type
				|| this.section.content !== content
				|| this.section.background !== background;
		} else {
			return content !== "" || background !== "#FFFFFF";
		}
	}

	imageUrlSubmitted(url) {
		this.goToImageUrlState(url);
	}

	imageUploaded(e) {
		const {url, imageId} = e;
		console.log(e)
		this.goToImageUploadState(imageId, url);
	}

	onImageClick(e: MouseEvent) {
		if (this.eyedrop) {
			const {offsetX, offsetY} = e;
			const {clientWidth, clientHeight} = this.image.nativeElement;

			if (this.type.value === this.typeContent.IMAGE) {
				const idControl = this.imageId.value;
				if (idControl != undefined || idControl != null) {
					const request = {
						x: offsetX,
						y: offsetY,
						width: clientWidth,
						height: clientHeight,
						imageId: idControl
					}
					this.dataService.runEyeDrop(request).toPromise().then((res) => {
						if (res.status) {
							this.background.setValue(res.data);
						}
						this.eyedrop = false;
					});
				}
			}
		}
	}

	onEyedrop(flag: boolean) {
		this.eyedrop = flag;
	}

	cancel() {
		this.eyedrop = false;
		if (this.isFormModified()) {
			if (confirm("변경사항을 저장하지 않고 편집을 끝내시겠습니까?")) {
				this.onFinished.emit(false);
			}
		} else {
			this.onFinished.emit(false);
		}
	}

	save() {
		this.eyedrop = false;
		
		const {background, content, type, width, imageId, imageUrl} = this.sectionForm.getRawValue();
		const sectionData = {
			...this.section,
			background: background,
			content: content,
			type: type,
			width: width
		};

		if (this.type.value == TypeContent.IMAGE) {
			sectionData['imageId'] = imageId;
		} else if (this.type.value == TypeContent.IMAGE_URL) {
			sectionData['content'] = imageUrl;
		}

		this.onFinished.emit(sectionData);
	}

	ngOnDestroy() {
		this.subscription.forEach(item => {
			item.unsubscribe();
		});
	}
}
