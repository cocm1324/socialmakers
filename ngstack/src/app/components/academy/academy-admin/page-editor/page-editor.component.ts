import { Component, OnInit } from '@angular/core';
import { ISection, IAboutUsEditorInput, IUpdateAboutUsReq, ICourseInfo } from '@app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_URL_TYPE } from '@app/models';
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
	aboutUsData: IAboutUsEditorInput;
	courseInfoData: ICourseInfo;
	loaded: boolean = false;
	editState = 0;

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
		if (this.isAboutUs()) {
			this.dataService.getAboutUs().toPromise().then(res => {
				if (res.status) {
					const {pageId, contents, name, imageId, imageUrl} = res.data;
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
					this.aboutUsData = {
						name: name,
						background: imageUrl,
						imageId: imageId
					};
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
					this.loaded = true;
				}
			}, reject => {
				console.log(reject);
			});
		} else if (this.isCourse()) {
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
					this.courseInfoData = res.data;
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
				this.loaded = true;
			});
		}
	}

	isAboutUs() {
		return this.pageType === PAGE_URL_TYPE.ABOUT_US;
	}
	isCourse() {
		return this.pageType === PAGE_URL_TYPE.COURSE;
	}
	isNotice() {
		return this.pageType === PAGE_URL_TYPE.NOTICE;
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

	onPageInfoFinished(e) {
		if (this.isAboutUs()) {
			const request: IUpdateAboutUsReq = {
				name: e.name,
				imageId: e.imageId
			};
			this.dataService.updateAboutUs(request).toPromise().then((res) => {
				if (res.status) {
					this.loadPage();
				}
			});
		}
	}

	onHeaderEditStateChange(e) {
		if (e) {
			this.editState = 1;
		} else {
			this.editState = 0;
		}
	}

	onBodyEditStateChange(e) {
		if (e) {
			this.editState = 2;
		} else {
			this.editState = 0;
		}
	}
}
