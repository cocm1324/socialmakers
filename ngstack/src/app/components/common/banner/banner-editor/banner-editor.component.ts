import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BANNER_TYPE, DELAY_TYPE, Banner } from '@models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'app-banner-editor',
	templateUrl: './banner-editor.component.html',
	styleUrls: ['./banner-editor.component.scss']
})
export class BannerEditorComponent implements OnInit, OnDestroy {
	
	@Input() banner: Banner;
	@Output() onEdit: EventEmitter<any> = new EventEmitter();

	edit: boolean = false;

	bannerTypes = BANNER_TYPE;
	bannerForm: FormGroup;

	showImageUploadDialogEvent: Subject<void> = new Subject<void>();

	colorPickerPannel: boolean = false;
	imageBlurPannel: boolean = false;

	subscriptions: Subscription[] = [];

	get bannerType() {return this.bannerForm.get('bannerType');}
	get bannerImageId() {return this.bannerForm.get('bannerImageId');}
	get bannerImageUrl() {return this.bannerForm.get('bannerImageUrl');}
	get bannerImageBlur() {return this.bannerForm.get('bannerImageBlur');}
	get bannerColor() {return this.bannerForm.get('bannerColor');}
	get blurValue() {return `blur(${this.bannerImageBlur.value}px)`;}

    constructor(
		private fb: FormBuilder
	) { }

    ngOnInit() {
		this.initializeForm();
		this.registerFormChange();
	}

	initializeForm() {
		if (this.banner) {
			const { bannerColor, bannerImageUrl, bannerImageBlur, bannerImageId } = this.banner;
			this.bannerForm = this.fb.group({
				bannerImageId,
				bannerImageUrl,
				bannerImageBlur,
				bannerColor: bannerColor ? bannerColor : "#ffffff",
				bannerType: bannerColor ? this.bannerTypes.COLOR : this.bannerTypes.IMAGE
			});
			this.edit = false;
		} else {
			this.bannerForm = this.fb.group({
				bannerImageId: null,
				bannerImageUrl: "",
				bannerImageBlur: 0,
				bannerColor: "#ffffff",
				bannerType: this.bannerTypes.IMAGE
			});
			this.edit = false;
		}
	}

	registerFormChange() {
		const formChange = this.bannerForm.valueChanges.pipe(
			distinctUntilChanged(),
			debounceTime(DELAY_TYPE.MEDIUM)
		).subscribe(next => {
			const { bannerImageId, bannerImageBlur, bannerColor, bannerType } = next;
			const banner = { bannerImageId, bannerImageBlur };
			if (bannerType == BANNER_TYPE.COLOR) {
				banner['bannerColor'] = bannerColor;
			}
			this.closeAllPannel();
			this.onEdit.emit(banner);
		});
		this.subscriptions.push(formChange);
	}

	isImage() {
		return this.bannerType.value == this.bannerTypes.IMAGE;
	}

	imageBannerSelected() {
		if (this.bannerType.value == this.bannerTypes.COLOR) {
			this.bannerType.patchValue(this.bannerTypes.IMAGE);
		}
		this.closeAllPannel();
	}

	colorBannerSelected() {
		if (this.bannerType.value == this.bannerTypes.IMAGE) {
			this.bannerType.patchValue(this.bannerTypes.COLOR);
		}
		this.closeAllPannel();
	}

	showImageUploadDialog() {
		this.closeAllPannel();
		this.showImageUploadDialogEvent.next();
	}

	imageUploaded(e) {
		this.bannerImageId.patchValue(e.imageId);
		this.bannerImageUrl.patchValue(e.url);
	}

	toggleColorPickerPannel() {
		this.colorPickerPannel = !this.colorPickerPannel;
	}

	toggleImageBlurPannel() {
		if (this.isImage()) {
			this.imageBlurPannel = !this.imageBlurPannel;
		}
	}

	closeAllPannel() {
		this.colorPickerPannel = false;
		this.imageBlurPannel = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
