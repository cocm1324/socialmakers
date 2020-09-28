import { Component, OnInit } from '@angular/core';
import { 
	IAboutUsEditorInput, IUpdateAboutUsReq, ICourseInfo, IUpdateCourseInfoReq, 
	ICreateCourseReq, ISectionWithContentId, ACADEMY_ADMIN_URL, PAGE_TYPE, INoticeEditorInput 
} from '@app/models';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit {

	pageType: PAGE_TYPE;
	pageId: number;
	contents: ISectionWithContentId[] = null;
	aboutUsData: IAboutUsEditorInput;
	courseInfoData: ICourseInfo;
	noticeInfoData: INoticeEditorInput;

	loaded: boolean = false;
	childComponentEditState = 0;

	isNewPage = false;

	constructor(
		private router: Router,
		private dataService: DataService
	) { }

	ngOnInit() {
		this.parseUrl();
		this.loadPage();
	}

	parseUrl() {
		const parsedUrl = this.router.url.split('/');
		const possibleId = parsedUrl[parsedUrl.length - 1];
		const curUrl = this.router.url;

		if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.ABOUT_US}`) {
			this.pageType = PAGE_TYPE.ABOUT_US;
		} else if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NEW_COURSE}`) {
			this.pageType = PAGE_TYPE.COURSE;
			this.isNewPage = true;
		} else if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.COURSE_FRAGMENT}/${parsedUrl[parsedUrl.length - 1]}`) {
			this.pageType = PAGE_TYPE.COURSE;
			this.isNewPage = false;
			this.pageId = parseInt(possibleId);
		} else if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NOTICE_FRAGMENT}/${parsedUrl[parsedUrl.length - 1]}`) {
			this.pageType = PAGE_TYPE.NOTICE;
			this.isNewPage = false;
			this.pageId = parseInt(possibleId);
		}
	}

	loadPage() {
		if (!this.isNewPage) {
			if (this.isAboutUs()) {
				this.dataService.getAboutUs().toPromise().then(res => {
					if (res.status) {
						const {pageId, contents} = res.data;
						this.pageId = pageId;
						this.aboutUsData = res.data;
						this.initContent(contents);
						this.loaded = true;
					}
				}, reject => {
					console.log(reject);
				});
			} else if (this.isCourse()) {
				this.dataService.getCourse(this.pageId).toPromise().then(res => {
					if (res.status) {
						const {courseId, contents} = res.data;
						this.pageId = courseId;
						this.courseInfoData = res.data;
						this.initContent(contents);
						this.loaded = true;
					}
				});
			} else if (this.isNotice()) {
				this.dataService.getNotice(this.pageId).toPromise().then(res => {
					if (res.status) {
						const {noticeId, contents} = res.data;
						this.pageId = noticeId;
						this.noticeInfoData = res.data;
						this.initContent(contents);
						this.loaded = true;
					}
				});
			}
		} else {
			this.loaded = true;
		}
	}

	isAboutUs() {
		return this.pageType === PAGE_TYPE.ABOUT_US;
	}
	isCourse() {
		return this.pageType === PAGE_TYPE.COURSE;
	}
	isNotice() {
		return this.pageType === PAGE_TYPE.NOTICE;
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

	onFinished(e) {
		if (e) {
			this.router.navigate([ACADEMY_ADMIN_URL.PREFIX]);
		}
	}

	onSectionFinished(e) {
		const request = {
			pageId: this.pageId,
			...e
		};

		console.log(request)

		if (this.contents.some(section => {return section.contentId == request.contentId})) {
			this.dataService.updateSection(request).toPromise().then((response) => {
				if (response.status) {
					this.loadPage();
				} else {
					alert(response.error ? response.error.message: "unknown error");
				}
			});
		} else {
			delete request.contentId;
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
		const {contentId} = e;
		const request = {
			pageId: this.pageId,
			contentId: contentId
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
				pageName: e.pageName,
				bannerImageId: e.bannerImageId,
				bannerImageBlur: e.bannerImageBlur
			};

			if (e.bannerColor) {
				request['bannerColor'] = e.bannerColor;
			}

			this.dataService.updateAboutUs(request).toPromise().then((res) => {
				if (res.status) {
					this.loadPage();
				}
			});
		} else if (this.isCourse()) {
			if (this.isNewPage) {
				const request: ICreateCourseReq = {
					...e
				};

				console.log(request)

				this.dataService.createCourse(request).toPromise().then(res => {
					if (res.status) {
						const {courseId} = res.data;
						this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.COURSE_FRAGMENT}/${courseId}`]);
					}
				});
			} else {
				const request: IUpdateCourseInfoReq = {
					courseId: this.pageId,
					...e
				};
				this.dataService.updateCourseInfo(request).toPromise().then((res) => {
					if (res.status) {
						this.loadPage();
					}
				});
			}
		} else if (this.isNotice()) {
			if (this.isNewPage) {

			} else {
				
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
