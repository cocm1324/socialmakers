import { Component, OnInit } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent, ISectionWithContentId } from '@app/models';
import { DataService } from '@services/data/data.service';
import { UtilService } from '@services/util/util.service';

@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

	page: ISection[];
	contents

	pageName: string;
	banner;

	loaded: boolean = false;

	constructor(
		private dataService: DataService,
		private util: UtilService
	) { }

	ngOnInit() {
		this.loadData();
	}

	loadData() {
		this.dataService.getAboutUs().toPromise().then(result => {
			const { status, data } = result;

			if (status) {
				const { contents, bannerImageBlur, bannerImageUrl, bannerColor, bannerImageId, pageName } = data;
				this.initContent(contents);
				this.banner = { bannerColor, bannerImageBlur, bannerImageUrl, bannerImageId };
				this.pageName = pageName;
				this.loaded = true;
			}
		}, reject => {
			console.log(reject);
		});
	}

	initContent(data: ISectionWithContentId[]) {
		data.sort((a, b)=> {
			if (a.seq - b.seq < 0) {
				return -1;
			}
			if (a.seq - b.seq > 0) {
				return 1;
			}
			return 0;
		});

		const mappedContent = data.map(content => {
			const contentMap = {
				contentId: content.contentId,
				width: content.width,
				type: content.type,
				content: content.content,
				seq: content.seq,
				seqBase: content.seqBase,
				background: content.background
			};
			if (content.imageId) {
				contentMap['imageId'] = content.imageId;
				contentMap['imageUrl'] = content.imageUrl;
			}
			return contentMap;
		});

		this.contents = mappedContent;
	}
}
