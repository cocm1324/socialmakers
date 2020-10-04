import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BannerInput, BANNER_TYPE } from '@app/models/';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-banner-editor',
	templateUrl: './banner-editor.component.html',
	styleUrls: ['./banner-editor.component.scss']
})
export class BannerEditorComponent implements OnInit, AfterViewInit {

	@Input() content: BannerInput;
	@Output() onContentChange: EventEmitter<any> = new EventEmitter();
	@Output() onFinish: EventEmitter<any> = new EventEmitter();

	isEdit: boolean = false;

	bannerTypes = BANNER_TYPE;
	bannerType: BANNER_TYPE = this.bannerTypes.IMAGE;

	bannerForm: FormGroup;

	showImageUploadDialogEvent: Subject<void> = new Subject<void>();

	colorPickerPannel: boolean = false;
	imageBlurPannel: boolean = false;

	get bannerImageId() {return this.bannerForm.get('bannerImageId');}
	get bannerImageUrl() {return this.bannerForm.get('bannerImageUrl');}
	get bannerImageBlur() {return this.bannerForm.get('bannerImageBlur');}
	get bannerColor() {return this.bannerForm.get('bannerColor');}
	get blurValue() {return `blur(${this.bannerImageBlur.value}px)`;}

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
		this.bannerForm = this.fb.group({
			bannerImageId: null,
			bannerImageUrl: "",
			bannerImageBlur: 0,
			bannerColor: "#ffffff"
		});

		if (this.content) {
			this.isEdit = true;

			if (this.content.bannerImageId) {
				this.bannerImageId.patchValue(this.content.bannerImageId);
				this.bannerImageUrl.patchValue(this.content.bannerImageUrl);
				this.bannerImageBlur.patchValue(this.content.bannerColor);
				this.bannerType = this.bannerTypes.IMAGE;

			} else {
				this.bannerColor.patchValue(this.content.bannerColor);
				this.bannerType = this.bannerTypes.COLOR;
			}
		} else {
			this.isEdit = false;
		}
	}

	ngAfterViewInit() { }

	imageBannerSelected() {
		if (this.bannerType == this.bannerTypes.COLOR) {
			this.bannerType = this.bannerTypes.IMAGE;
		}
		this.closeAllPannel();
	}

	colorBannerSelected() {
		if (this.bannerType == this.bannerTypes.IMAGE) {
			this.bannerType = this.bannerTypes.COLOR;
		}
		this.closeAllPannel();
	}
	
	isImage() {
		return this.bannerType == this.bannerTypes.IMAGE;
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
		if (this.isEdit) {
			this.imageBlurPannel = !this.imageBlurPannel;
		}
	}

	closeAllPannel() {
		this.colorPickerPannel = false;
		this.imageBlurPannel = false;
	}
}
