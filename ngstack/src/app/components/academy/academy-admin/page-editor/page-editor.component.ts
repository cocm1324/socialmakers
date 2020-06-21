import { Component, OnInit, Input } from '@angular/core';
import { ISection } from '@components/common/page/common';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { PAGE_URL_TYPE, WIDTH_TYPE, CONTENT_TYPE } from '@app/models';
import { DataService } from '@services/data/data.service';
import { resolve } from 'url';

const page = [
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_01.jpg"
	},
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_02.jpg"
	},
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_03.png"
	}
]

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

	pageType: string;
	id: string;
	contents: ISection[];
	isEdit: boolean = true;

	constructor(private route: ActivatedRoute, private dataService: DataService) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.pageType = params.pageType;
			if (this.pageType === PAGE_URL_TYPE.ABOUT_US) {
				this.dataService.getAboutUs().toPromise().then(resolve => {
					
				}, reject => {

				});
			} else {
				this.id = params.id;
			}
		});
		this.contents = page;
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
				if (section.contentId) {
					sectionMap['imageId'] = section.contentId;
				}

				return sectionMap;
			});

			console.log(this.contents);
			const request = {
				
			}
		}
	}
}
