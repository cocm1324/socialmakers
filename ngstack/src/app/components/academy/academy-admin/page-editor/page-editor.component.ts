import { Component, OnInit, Input } from '@angular/core';
import { ISection, TypeSectionWidth, TypeContent } from '@app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_URL_TYPE} from '@app/models';
import { DataService } from '@services/data/data.service';

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
			this.dataService.getAboutUs().toPromise().then(res => {
				if (res.status) {
					const {pageId, contents} = res.data;
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
		} else if (this.pageType === PAGE_URL_TYPE.COURSE) {
			this.dataService.getCourse(this.id).toPromise().then(res => {
				if (res.status) {
					const {courseId, contents} = res.data;
					this.id = courseId;
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
			});
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

		if (this.contents.some(section => {return section.seq == request.seq})) {
			this.dataService.updateSection(request).toPromise().then((response) => {
				if (response.status) {
					this.loadPage();
				} else {
					alert(response.error ? response.error.message: "unknown error");
				}
			});
		} else {
			this.dataService.createSection(request).toPromise().then((response) => {
				if (response.status) {
					this.loadPage();
				} else {
					alert(response.error ? response.error.message: "unknown error");
				}
			});
		}
	}

	onSectionDelete(e) {
		const {seq, seqBase} = e;
		const request = {
			pageId: this.id,
			seq: seq,
			seqBase: seqBase
		}

		this.dataService.deleteSection(request).toPromise().then((response) => {
			if (response.status) {
				this.loadPage();
			} else {
				alert(response.error ? response.error.message: "unknown error");
			}
		});
	}
}
