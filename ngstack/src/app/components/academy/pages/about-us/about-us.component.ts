import { Component, OnInit } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent } from '@components/common/page/common';
import { DataService } from '@services/data/data.service';
import { WIDTH_TYPE, CONTENT_TYPE } from '@app/models';

@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

	page: ISection[];

	constructor(private dataService: DataService) { }

	ngOnInit() {
		this.dataService.getAboutUs().toPromise().then(resolve => {
			if (resolve.status) {
				const {contents} = resolve.data;
				contents.sort((a, b)=> {
					if (a.seq - b.seq < 0) {
						return -1;
					}
					if (a.seq - b.seq > 0) {
						return 1;
					}
					return 0;
				});
				this.page = contents.map(content => {
					const contentMap = {
						width: content.width===WIDTH_TYPE.NARROW ? TypeSectionWidth.NARROW : content.width===WIDTH_TYPE.MEDIUM ? TypeSectionWidth.MEDIUM : TypeSectionWidth.WIDE,
						type: content.type===CONTENT_TYPE.POST ? TypeContent.POST : TypeContent.IMAGE,
						content: content.content
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
