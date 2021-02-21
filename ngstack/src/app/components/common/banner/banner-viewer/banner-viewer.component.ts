import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BANNER_TYPE, PAGE_TYPE } from '@app/models/';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'app-banner-viewer',
	templateUrl: './banner-viewer.component.html',
	styleUrls: ['./banner-viewer.component.scss']
})
export class BannerViewerComponent implements OnInit, OnDestroy {

	@Input() pageType: PAGE_TYPE;
	@Input() isNewPage: boolean;

	bannerTypes = BANNER_TYPE;
	pageTypes = PAGE_TYPE;

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
		// this.getBannerAndPatchForm();
		// this.registerFormChange();
	}

	initializeForm() {
		this.bannerForm = this.fb.group({
			bannerImageId: null,
			bannerImageUrl: "",
			bannerImageBlur: 0,
			bannerColor: "#ffffff",
			bannerType: this.bannerTypes.IMAGE
		});
	}

	// getBannerAndPatchForm() {
	// 	if (!this.isNewPage) {
	// 		const getOnce = this.pageEditorService.getBanner().pipe(
	// 			take(1)
	// 		).subscribe(next => {
	// 			const {bannerImageId, bannerImageUrl, bannerImageBlur, bannerColor} = next;

	// 			if (bannerImageId) {
	// 				this.bannerImageId.patchValue(bannerImageId);
	// 				this.bannerImageUrl.patchValue(bannerImageUrl);
	// 				this.bannerImageBlur.patchValue(bannerImageBlur);
	// 				this.bannerType.patchValue(this.bannerTypes.IMAGE);
	// 			} else {
	// 				this.bannerColor.patchValue(bannerColor);
	// 				this.bannerType.patchValue(this.bannerTypes.COLOR);
	// 			}
	// 		});
	// 		this.subscriptions.push(getOnce);
	// 	}
	// }

	// registerFormChange() {
	// 	const formChange = this.bannerForm.valueChanges.pipe(
	// 		distinctUntilChanged(),
	// 		debounceTime(DELAY_TYPE.MEDIUM)
	// 	).subscribe(next => {
	// 		const {bannerImageId, bannerImageUrl, bannerImageBlur, bannerColor} = <Banner>next;
	// 		const current = this.pageEditorService.getBanner().pipe(
	// 			take(1)
	// 		).subscribe(next => {
	// 			const banner = {
	// 				...next,
	// 				bannerImageId: bannerImageId,
	// 				bannerImageUrl: bannerImageUrl,
	// 				bannerImageBlur: bannerImageBlur,
	// 				bannerColor: bannerColor
	// 			};

	// 			if (this.isImage()) {
	// 				delete banner.bannerColor;
	// 			} else {
	// 				delete banner.bannerImageId;
	// 				delete banner.bannerImageUrl;
	// 				delete banner.bannerImageBlur;
	// 			}

	// 			this.closeAllPannel();
	// 			this.pageEditorService.nextBanner(banner);
	// 		});
	// 		this.subscriptions.push(current);
	// 	});
	// 	this.subscriptions.push(formChange);
	// }

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
		if (!this.isNewPage) {
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
