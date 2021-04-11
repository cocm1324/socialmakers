import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Banner, BANNER_TYPE, PAGE_TYPE } from '@app/models/';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'app-banner-viewer',
	templateUrl: './banner-viewer.component.html',
	styleUrls: ['./banner-viewer.component.scss']
})
export class BannerViewerComponent implements OnInit {

	@Input() banner: Banner;

	bannerType: BANNER_TYPE;
	bannerColor: string;
	bannerImageUrl: string;
	bannerImageBlur: number;
	
	get blurValue() {return `blur(${this.bannerImageBlur}px)`;}

    constructor() { }

    ngOnInit() {
		const { bannerColor, bannerImageUrl, bannerImageBlur } = this.banner;

		if (bannerColor) {
			this.bannerType = BANNER_TYPE.COLOR;
		} else {
			this.bannerType = BANNER_TYPE.IMAGE;
		}

		this.bannerImageUrl = bannerImageUrl;
		this.bannerImageBlur = bannerImageBlur;
		this.bannerColor = bannerColor;
	}

	isImage() {
		return this.bannerType == BANNER_TYPE.IMAGE;
	}

}
