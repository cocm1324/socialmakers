import { Component, OnInit, Input } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent } from '@components/common/page/common';
import { ActivatedRoute } from '@angular/router';
import { PAGE_URL_TYPE, WIDTH_TYPE, CONTENT_TYPE } from '@app/models';
import { DataService } from '@services/data/data.service';
import { resolve } from 'url';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

	pageType: string;
	id: any;
	contents: ISection[];
	isEdit: boolean = true;

	constructor(private route: ActivatedRoute, private dataService: DataService) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.pageType = params.pageType;
			if (this.pageType === PAGE_URL_TYPE.ABOUT_US) {
				this.dataService.getAboutUs().toPromise().then(resolve => {
					if (resolve.status) {
						const {pageId, contents} = resolve.data;
						this.id = pageId;
						contents.sort((a, b)=> {
							if (a.seq - b.seq < 0) {
								return -1;
							}
							if (a.seq - b.seq > 0) {
								return 1;
							}
							return 0;
						});
						this.contents = contents.map(content => {
							const contentMap = {
								width: content.width===WIDTH_TYPE.NARROW ? TypeSectionWidth.NARROW : content.width===WIDTH_TYPE.MEDIUM ? TypeSectionWidth.MEDIUM : TypeSectionWidth.WIDE,
								type: content.type===CONTENT_TYPE.POST ? TypeContent.POST : content.type===CONTENT_TYPE.IMAGE_URL ? TypeContent.IMAGE_URL: TypeContent.IMAGE,
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
			} else {
				this.id = params.id;
			}
		});
	}

	editFinished(e) {
		if (e && e.length > 0) {
			this.contents = e;
			const pageMap = this.contents.map((section, index) => {
				const sectionMap = {
					seq: index,
					width: section.width == 0 ? WIDTH_TYPE.NARROW : section.width == 1 ? WIDTH_TYPE.MEDIUM : WIDTH_TYPE.WIDE,
					type: section.type == 0 ? CONTENT_TYPE.IMAGE_URL : section.type == 1 ? CONTENT_TYPE.IMAGE : CONTENT_TYPE.POST,
					content: section.content
				}
				if (section.imageId) {
					sectionMap['imageId'] = section.imageId;
				}

				return sectionMap;
			});

			const request = {
				pageId: this.id,
				content: pageMap
			}

			this.dataService.updatePage(request).toPromise().then(resolve => {
				
			}, reject => {

			});
		}
	}
}
