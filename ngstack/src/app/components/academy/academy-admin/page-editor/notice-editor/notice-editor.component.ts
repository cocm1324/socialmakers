import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { INoticeEditorInput, DATA_LENGTH, BANNER_TYPE } from '@app/models/';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UtilService } from '@services/util/util.service';

@Component({
	selector: 'app-notice-editor',
	templateUrl: './notice-editor.component.html',
	styleUrls: ['./notice-editor.component.scss']
})
export class NoticeEditorComponent implements OnInit, OnDestroy {

	@Input() noticeInfoData: INoticeEditorInput;
	@Input() disabledByParent: boolean;
	@Input() isNewPage: boolean = false;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<INoticeEditorInput> = new EventEmitter();
	
	noticeForm: FormGroup;
	isEdit: boolean;
	lock: boolean = false;
	colorPicker: boolean = false;

	fontColor: string = '#000000';

	dataLength = DATA_LENGTH;
	bannerTypes = [
		{label: "이미지", value: BANNER_TYPE.IMAGE}, 
		{label: "단색", value: BANNER_TYPE.COLOR}
	];

	showImageUploadDialogEvent: Subject<void> = new Subject<void>();

	subscription: Subscription[] = [];

	get noticeName() {return this.noticeForm.get('noticeName');}
	get bannerType() {return this.noticeForm.get('bannerType');}
	get bannerImageId() {return this.noticeForm.get('bannerImageId');}
	get bannerImageUrl() {return this.noticeForm.get('bannerImageUrl');}
	get bannerImageBlur() {return this.noticeForm.get('bannerImageBlur');}
	get bannerColor() {return this.noticeForm.get('bannerColor');}
	get blurValue() {return `blur(${this.bannerImageBlur.value}px)`;}

	constructor(private fb: FormBuilder, private utilService: UtilService) { }

	ngOnInit() {
		this.isEdit = false;
		this.onEditStateChange.emit(this.isEdit);
		this.noticeForm = this.fb.group({
			noticeName: ["", Validators.required],
			bannerType: [this.bannerTypes[0].value, Validators.required],
			bannerImageId: [null, Validators.required],
			bannerImageUrl: [""],
			bannerImageBlur: [0],
			bannerColor: ["#ffffff"]
		});

		const bannerTypeChange = this.bannerType.valueChanges.subscribe(value => {
			if (this.isImage()) {
				this.bannerImageId.setValidators(Validators.required);
				this.bannerImageId.updateValueAndValidity();
			} else {
				this.bannerImageId.clearValidators();
				this.bannerImageId.updateValueAndValidity();
			}
		});
		this.subscription.push(bannerTypeChange);

		const bannerColorChange = this.bannerColor.valueChanges.subscribe(value => {
			console.log('yeet')
			if (!this.isImage()) {
				const inversedColor = this.utilService.backgroundReactiveFontColor(value);
				console.log(inversedColor);
			}
		});
		this.subscription.push(bannerColorChange);

		if (this.isNewPage) {
			this.isEdit = true;
		} else {
			this.mapFormControls();
		}
		this.onEditStateChange.emit(this.isEdit);
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

	showImageUploadDialog() {
		this.showImageUploadDialogEvent.next();
	}

	toggleColorPicker() {
		this.colorPicker = !this.colorPicker;
	}

	imageUploaded(e) {
		const {url, imageId} = e;

		if (url && imageId) {
			this.bannerType.patchValue(this.bannerTypes[0].value);
			this.bannerImageId.patchValue(imageId);
			this.bannerImageUrl.patchValue(url);
		}
	}

	isChanged() {
		if (!this.noticeInfoData) {
			return true;
		}

		const {noticeName, bannerImageId, bannerImageBlur, bannerColor} = this.noticeForm.getRawValue();
		if (!this.noticeInfoData.bannerColor == this.isImage()) {
			return true;
		}
		
		const dataChanged = noticeName !== this.noticeInfoData.noticeName 
			|| bannerImageId !== this.noticeInfoData.bannerImageId 
			|| bannerImageBlur != this.noticeInfoData.bannerImageBlur;
		const bannerTypeChanged = this.isImage() != !this.noticeInfoData.bannerColor;

		return dataChanged || bannerTypeChanged;
	}

	mapFormControls() { 
		if (this.noticeInfoData) {
			const {
				noticeName, bannerImageId, bannerImageUrl, bannerImageBlur, bannerColor
			} = this.noticeInfoData;

			this.noticeForm.patchValue({
				noticeName: noticeName,
				bannerImageId: bannerImageId,
				bannerImageUrl: bannerImageUrl,
				bannerImageBlur: bannerImageBlur
			});

			if (bannerColor) {
				this.bannerType.patchValue(this.bannerTypes[1].value);
				this.bannerColor.patchValue(bannerColor);
			} else {
				this.bannerImageId.patchValue(bannerImageId);
				this.bannerImageUrl.patchValue(bannerImageUrl);
				this.bannerImageBlur.patchValue(bannerImageBlur);
			}
		}
	}

	edit() {
		this.isEdit = true;
		this.onEditStateChange.emit(this.isEdit);
	}

	save() {
		if (this.isChanged()) {
			const formData: INoticeEditorInput = {
				...this.noticeInfoData,
				noticeName: this.noticeName.value,
				bannerImageId: this.bannerImageId.value,
				bannerImageBlur: this.bannerImageBlur.value,
			};
			if (this.isImage()) {
				formData['bannerImageId'] = this.bannerImageId.value;
				formData['bannerImageBlur'] = this.bannerImageBlur.value;
			} else {
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
				this.noticeForm.patchValue({noticeName: this.noticeInfoData.noticeName})
				if (this.noticeInfoData.bannerColor) {
					this.noticeForm.patchValue({
						bannerImageId: this.noticeInfoData.bannerImageId,
						bannerImageUrl: this.noticeInfoData.bannerImageUrl,
						bannerImageBlur: this.noticeInfoData.bannerImageBlur
					});
				} else {
					this.noticeForm.patchValue({bannerColor: this.noticeInfoData.bannerColor});
				}
				this.isEdit = false;
				this.onEditStateChange.emit(this.isEdit);
			}
		} else {
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		}
	}

	ngOnDestroy() {
		this.subscription.forEach(elem => {
			elem.unsubscribe();
		});
	}
}
