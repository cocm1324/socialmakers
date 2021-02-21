import { Component, OnInit } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent } from '@app/models';
import { DataService } from '@services/data/data.service';
import { UtilService } from '@services/util/util.service';

@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

	page: ISection[];

	constructor(
		private dataService: DataService,
		private util: UtilService
	) { }

	ngOnInit() {
		this.loadData();
	}

	loadData() {
		this.dataService.getAboutUs().toPromise().then(resolve => {
			console.log(resolve)

			const { status, data } = resolve;

			if (status) {
				const { contents, bannerImageBlur, bannerImageUrl, bannerColor, bannerImageId } = data;
				contents.sort(this.util.contentSerializer);
				this.page = contents.map(content => {
					const contentMap = {
						width: content.width,
						type: content.type,
						content: content.content,
						seq: content.seq,
						seqBase: content.seqBase,
						background: content.background
					};
					if (content.imageId) {
						contentMap['imageId'] = content.imageId;
					}
					return contentMap;
				});
			}
		}, reject => {
			console.log(reject);
		});
	}
}
