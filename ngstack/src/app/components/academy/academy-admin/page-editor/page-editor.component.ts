import { Component, OnInit } from '@angular/core';
import { ISection, IAboutUsEditorInput, IUpdateAboutUsReq, ICourseInfo, IUpdateCourseInfoReq, ICreateCourseReq } from '@app/models';
import { Router } from '@angular/router';
import { PAGE_URL_TYPE } from '@app/models';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

	pageType: string;
	id: number;
	contents: ISection[] = null;
	aboutUsData: IAboutUsEditorInput;
	courseInfoData: ICourseInfo;
	
	loaded: boolean = false;
	childComponentEditState = 0;

	isNewPage = false;

	constructor(
		private router: Router,
		private dataService: DataService
	) { }

	ngOnInit() {
		const parsedUrl = this.router.url.split('/');

		if (parsedUrl[parsedUrl.length - 1] == PAGE_URL_TYPE.ABOUT_US) {
			this.pageType = PAGE_URL_TYPE.ABOUT_US;
		} else {
			if (parsedUrl[parsedUrl.length - 1] == PAGE_URL_TYPE.NEW) {
				this.isNewPage = true;
			} else {
				this.id = parseInt(parsedUrl[parsedUrl.length - 1]);
			}

			if (parsedUrl[parsedUrl.length - 2] == PAGE_URL_TYPE.COURSE) {
				this.pageType = PAGE_URL_TYPE.COURSE;
			} else if (parsedUrl[parsedUrl.length - 2] == PAGE_URL_TYPE.NOTICE) {
				this.pageType = PAGE_URL_TYPE.NOTICE;
			}
		}

		this.loadPage();
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
		} else if (this.isCourse()) {
			if (this.isNewPage) {
				const request: ICreateCourseReq = {
					seq: 1,
					seqBase: 1,
					...e
				}
			} else {
				const request: IUpdateCourseInfoReq = {
					courseId: this.id,
					...e
				};
				this.dataService.updateCourseInfo(request).toPromise().then((res) => {
					if (res.status) {
						this.loadPage();
					}
				});
			}
		}
	}

	onHeaderEditStateChange(e) {
		if (e) {
			this.childComponentEditState = 1;
		} else {
			this.childComponentEditState = 0;
		}
	}

	onBodyEditStateChange(e) {
		if (e) {
			this.childComponentEditState = 2;
		} else {
			this.childComponentEditState = 0;
		}
	}
}
