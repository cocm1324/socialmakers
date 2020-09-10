import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAboutUsEditorInput, DATA_LENGTH, BANNER_TYPE } from '@app/models';

@Component({
	selector: 'app-about-us-editor',
	templateUrl: './about-us-editor.component.html',
	styleUrls: ['./about-us-editor.component.scss']
})
export class AboutUsEditorComponent implements OnInit, OnChanges {

	@Input() aboutUsData: IAboutUsEditorInput;
	@Input() disabledByParent: boolean;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<IAboutUsEditorInput> = new EventEmitter();
	
	aboutUsForm: FormGroup;
	isEdit: boolean;
	lock: boolean = false;

	dataLength = DATA_LENGTH;
	bannerTypes = [
		{label: "이미지", value: BANNER_TYPE.IMAGE}, 
		{label: "단색", value: BANNER_TYPE.COLOR}
	];

	get pageName() {return this.aboutUsForm.get('pageName');}
	get bannerType() {return this.aboutUsForm.get('bannerType');}
	get bannerImageId() {return this.aboutUsForm.get('bannerImageId');}
	get bannerImageUrl() {return this.aboutUsForm.get('bannerImageUrl');}
	get bannerImageBlur() {return this.aboutUsForm.get('bannerImageBlur');}
	get bannerColor() {return this.aboutUsForm.get('bannerColor');}
	get blurValue() {return `blur(${this.bannerImageBlur.value}px)`;}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.isEdit = false;
		this.onEditStateChange.emit(this.isEdit);
		this.aboutUsForm = this.fb.group({
			pageName: ["", Validators.required],
			bannerType: [this.bannerTypes[0].value, Validators.required],
			bannerImageId: [null, Validators.required],
			bannerImageUrl: [""],
			bannerImageBlur: [0],
			bannerColor: ["#ffffff"]
		});

		if (this.aboutUsData) {
			this.aboutUsForm.patchValue({
				pageName: this.aboutUsData.pageName,
				bannerImageId: this.aboutUsData.bannerImageId,
				bannerImageUrl: this.aboutUsData.bannerImageUrl,
				bannerImageBlur: this.aboutUsData.bannerImageBlur
			});

			if (this.aboutUsData.bannerColor) {
				this.bannerType.patchValue(this.bannerTypes[1].value);
				this.bannerColor.patchValue(this.aboutUsData.bannerColor);
			}
		}
	}

	ngOnChanges() {
		if (this.disabledByParent != null && this.disabledByParent != undefined) {
			if (this.disabledByParent) {
				this.lock = true;
			} else {
				this.lock = false;
			}
		}
	}
	
	isImage() {
		return this.bannerType.value == this.bannerTypes[0].value;
	}

	imageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.bannerImageId.patchValue(imageId);
			this.bannerImageUrl.patchValue(url);
		}
	}

	isChanged() {
		const {pageName, bannerImageId, bannerImageBlur} = this.aboutUsForm.getRawValue();
		const dataChanged = pageName !== this.aboutUsData.pageName 
			|| bannerImageId !== this.aboutUsData.bannerImageId 
			|| bannerImageBlur != this.aboutUsData.bannerImageBlur;
		const bannerTypeChanged = this.isImage() != !this.aboutUsData.bannerColor;

		return dataChanged || bannerTypeChanged;
	}

	edit() {
		this.isEdit = true;
		this.onEditStateChange.emit(this.isEdit);
	}

	save() {
		if (this.isChanged()) {
			const formData: IAboutUsEditorInput = {
				pageName: this.pageName.value,
				bannerImageId: this.bannerImageId.value,
				bannerImageUrl: this.bannerImageUrl.value,
				bannerImageBlur: this.bannerImageBlur.value
			};
			if (!this.isImage()) {
				formData['bannerColor'] = this.bannerColor.value;
			}

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
					pageName: this.aboutUsData.pageName,
					bannerImageId: this.aboutUsData.bannerImageId,
					bannerImageUrl: this.aboutUsData.bannerImageUrl
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
