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
	@Input() disabledByParent: boolean;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<IAboutUsEditorInput> = new EventEmitter();
	aboutUsForm: FormGroup;
	isEdit: boolean;
	lock: boolean = false;

	get pageName() {return this.aboutUsForm.get('pageName');}
	get bannerImageId() {return this.aboutUsForm.get('bannerImageId');}
	get bannerImageUrl() {return this.aboutUsForm.get('bannerImageUrl');}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.isEdit = false;
		this.onEditStateChange.emit(this.isEdit);
		this.aboutUsForm = this.fb.group({
			pageName: ["", Validators.required],
			bannerImageId: [null, Validators.required],
			bannerImageUrl: ["", Validators.required]
		});

		if (this.aboutUsData) {
			this.aboutUsForm.patchValue({
				aboutUsName: this.aboutUsData.pageName,
				aboutUsImageId: this.aboutUsData.bannerImageId,
				aboutUsBackground: this.aboutUsData.bannerImageUrl
			});
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
	
	imageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.bannerImageId.patchValue(imageId);
			this.bannerImageUrl.patchValue(url);
		}
	}

	isChanged() {
		const {pageName, bannerImageId, bannerImageUrl} = this.aboutUsForm.getRawValue();
		return pageName !== this.aboutUsData.pageName || bannerImageId !== this.aboutUsData.bannerImageId || bannerImageUrl != this.aboutUsData.bannerImageUrl;
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
				bannerImageUrl: this.bannerImageUrl.value
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
