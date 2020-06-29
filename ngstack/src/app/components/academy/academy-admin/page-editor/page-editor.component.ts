import { Component, OnInit, Input } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent } from '@components/common/page/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_URL_TYPE, WIDTH_TYPE, CONTENT_TYPE } from '@app/models';
import { DataService } from '@services/data/data.service';
import { IUpdateSectionReq } from '@app/models';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

	pageType: string;
	id: any;
	contents: ISection[] = null;
	isEdit: boolean = true;

	constructor(
		private router: Router, 
		private route: ActivatedRoute, 
		private dataService: DataService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const {pageType, id} = params;
			this.pageType = pageType;
			if (id) {
				this.id = id;
			}
			this.loadPage();
		});
	}

	loadPage() {
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
							width: content.width === WIDTH_TYPE.NARROW ? TypeSectionWidth.NARROW : content.width === WIDTH_TYPE.MEDIUM ? TypeSectionWidth.MEDIUM : TypeSectionWidth.WIDE,
							type: content.type === CONTENT_TYPE.POST ? TypeContent.POST : content.type === CONTENT_TYPE.IMAGE_URL ? TypeContent.IMAGE_URL: TypeContent.IMAGE,
							content: content.content,
							seq: content.seq
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

		}
	}

	onFinished(e) {
		if (e) {
			this.router.navigate(['academy/admin']);
		}
	}

	onSectionFinished(e) {
		const request = {
			pageId: this.id,
			...e
		};

		console.log(request);

		if (this.contents.some(section => {return section.seq == request.seq})) {
			this.dataService.updateSection(request).toPromise().then((response) => {
				console.log(response);
				this.loadPage();
			});
		} else {
			this.dataService.createSection(request).toPromise().then((response) => {
				console.log(response);
				this.loadPage();
			});
		}
	}

	onSectionDelete(e) {
		const request = {
			pageId: this.id,
			seq: e
		}

		this.dataService.deleteSection(request).toPromise().then((response) => {
			if(response.status) {
				this.loadPage();
			}
		});
	}
}
