import { Component, OnDestroy, OnInit } from '@angular/core';
import { 
	AboutUsMeta, IUpdateAboutUsReq, ICourseInfo, IUpdateCourseInfoReq, 
	ICreateCourseReq, ISectionWithContentId, ACADEMY_ADMIN_URL, PAGE_TYPE, 
	NoticeEditorInput, BannerInput, NoticeBanner, IUpdateNoticeReq, AboutUsBanner, CourseBanner, Banner, CourseMeta 
} from '@app/models';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import { PageEditorService } from './page-editor.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
	selector: 'app-page-editor',
	templateUrl: './page-editor.component.html',
	styleUrls: ['./page-editor.component.scss']
})
export class PageEditorComponent implements OnInit, OnDestroy {

	pageType: PAGE_TYPE;
	pageId: number;
	contents: ISectionWithContentId[] = null;
	bannerMeta: BannerInput;
	bannerContent: AboutUsMeta | CourseMeta | NoticeEditorInput;
	aboutUsData: AboutUsMeta;
	courseInfoData: ICourseInfo;
	noticeInfoData: NoticeEditorInput;

	banner: Banner;

	pageTypes = PAGE_TYPE;

	loaded: boolean = false;
	childComponentEditState = 0;

	bannerMetaValid: boolean;

	isNewPage = false;

	subscriptions: Subscription[] = [];

	constructor(
		private router: Router,
		private dataService: DataService,
		private pageEditorService: PageEditorService
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
		} else if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NEW_NOTICE}`) {
			this.pageType = PAGE_TYPE.NOTICE;
			this.isNewPage = true;
		} else if (curUrl === `/${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NOTICE_FRAGMENT}/${parsedUrl[parsedUrl.length - 1]}`) {
			this.pageType = PAGE_TYPE.NOTICE;
			this.isNewPage = false;
			this.pageId = parseInt(possibleId);
		}
	}

	loadPage() {
		if (!this.isNewPage) {
			if (this.isAboutUs()) {
				this.loadAboutUs();
			} else if (this.isCourse()) {
				this.loadCourse();
			} else if (this.isNotice()) {
				this.loadNotice();
			}
		} else {
			this.loaded = true;
			this.banner = { bannerImageId: null, bannerImageUrl: "", bannerImageBlur: 0, bannerColor: "#ffffff" };
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

	loadAboutUs() {
		this.dataService.getAboutUs().toPromise().then(res => {
			if (res.status) {
				const {
					pageId, contents, pageName,
					bannerImageBlur, bannerImageId, bannerImageUrl, bannerColor,
				} = res.data;
				this.pageId = pageId;
				this.initContent(contents);
				this.banner = {
					bannerColor,
					bannerImageId,
					bannerImageBlur,
					bannerImageUrl
				};
				this.bannerContent = <AboutUsMeta>{ pageName }
				this.loaded = true;
			}
		}, reject => {
			console.log(reject);
		});
	}

	loadCourse() {
		this.dataService.getCourse(this.pageId).toPromise().then(res => {
			if (res.status) {
				const {
					courseId, contents, bannerImageId, bannerImageUrl, bannerImageBlur, bannerColor,
					courseName, description1, description2, field1, field2, field3, field4, field5, field6,
					fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
				} = res.data;

				this.pageId = courseId;
				this.initContent(contents);
				this.banner = { bannerColor, bannerImageId, bannerImageBlur, bannerImageUrl }
				this.bannerContent = <CourseMeta>{
					courseName, description1, description2, field1, field2, field3, field4, field5, field6,
					fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
				}
				this.loaded = true;
				// const courseBanner: CourseBanner = {
				// 	bannerImageId: bannerImageId,
				// 	bannerImageUrl: bannerImageUrl,
				// 	bannerImageBlur: bannerImageBlur,
				// 	bannerColor: bannerColor,
				// 	courseName: courseName,
				// 	description1: description1,
				// 	description2: description2,
				// 	field1: field1,
				// 	field2: field2,
				// 	field3: field3,
				// 	field4: field4,
				// 	field5: field5,
				// 	field6: field6,
				// 	fieldTitle1: fieldTitle1,
				// 	fieldTitle2: fieldTitle2,
				// 	fieldTitle3: fieldTitle3,
				// 	fieldTitle4: fieldTitle4,
				// 	fieldTitle5: fieldTitle5,
				// 	fieldTitle6: fieldTitle6,
				// 	registerUrl: registerUrl
				// };

				// if (bannerImageId) {
				// 	delete courseBanner.bannerColor;
				// } else {
				// 	delete courseBanner.bannerImageId;
				// 	delete courseBanner.bannerImageUrl;
				// 	delete courseBanner.bannerImageBlur;
				// }

				// this.pageEditorService.nextBanner(courseBanner);

				// const courseBannerChange = this.pageEditorService.getBanner().pipe(
				// 	skip(1)
				// ).subscribe(next => {
				// 	this.onCourseBannerChanged(next);
				// });
				// this.subscriptions.push(courseBannerChange);

				// this.loaded = true;
			}
		});
	}

	loadNotice() {
		this.dataService.getNotice(this.pageId).toPromise().then(res => {
			if (res.status) {
				const {
					noticeId, contents, 
					bannerColor, bannerImageBlur, bannerImageUrl, bannerImageId,
					noticeName, creationDateTime, updateDateTime
				} = res.data;

				this.pageId = noticeId;
				this.initContent(contents);

				const noticeBanner: NoticeBanner = {
					bannerImageId: bannerImageId,
					bannerImageUrl: bannerImageUrl,
					bannerImageBlur: bannerImageBlur,
					bannerColor: bannerColor,
					noticeName: noticeName,
					creationDateTime: creationDateTime,
					updateDateTime: updateDateTime
				}

				if (bannerImageId) {
					delete noticeBanner.bannerColor;
				} else {
					delete noticeBanner.bannerImageId;
					delete noticeBanner.bannerImageUrl;
					delete noticeBanner.bannerImageBlur;
				}

				this.pageEditorService.nextBanner(noticeBanner);

				const noticeBannerChange = this.pageEditorService.getBanner().pipe(
					skip(1)
				).subscribe(next => {
					this.onNoticeBannerChanged(next);
				});
				this.subscriptions.push(noticeBannerChange);

				this.loaded = true;
			}
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

	onBannerChange(e) {
		console.log(e)
		this.banner = e;
		if (this.isAboutUs()) {
			this.onAboutUsBannerChanged(<AboutUsMeta>this.bannerContent, this.banner);
		} else if (this.isCourse()) {
			this.onCourseBannerChanged(<CourseMeta>this.bannerContent, this.banner);
		}
	}

	onBannerContentChange(e) {
		console.log(e)
		this.bannerContent = e;
		if (this.isAboutUs()) {
			this.onAboutUsBannerChanged(<AboutUsMeta>this.bannerContent, this.banner);
		} else if (this.isCourse()) {
			this.onCourseBannerChanged(<CourseMeta>this.bannerContent, this.banner);
		}
	}

	onPageInfoFinished(e) {
		if (this.isCourse()) {
			if (this.isNewPage) {
				const request: ICreateCourseReq = {
					...e
				};

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
		}
	}

	onAboutUsBannerChanged(meta: AboutUsMeta, banner: Banner) {
		const { bannerColor, bannerImageBlur, bannerImageId } = banner;
		const { pageName } = meta;

		const request: IUpdateAboutUsReq = {
			pageName,
			bannerImageId,
			bannerImageBlur,
			bannerColor
		};

		this.dataService.updateAboutUs(request).toPromise().then((res) => {
			if (res.status) {
				
			} else {

			}
		});
	}

	onCourseBannerChanged(meta: CourseMeta, banner: Banner) {
		if (!this.isNewPage) {
			const {
				courseName, description1, description2, field1, field2, field3, field4, field5, field6,
				fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
			} = meta;
			const { bannerImageId, bannerImageBlur, bannerColor } = banner;

			const request: IUpdateCourseInfoReq = {
				courseId: this.pageId, courseName, bannerImageId, bannerImageBlur, 
				bannerColor, description1, description2, field1, field2, field3, 
				field4, field5, field6, fieldTitle1, fieldTitle2, fieldTitle3, 
				fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
			};

			this.dataService.updateCourseInfo(request).toPromise().then((res) => {
				if (res.status) {
				
				} else {
	
				}
			});
		}
	}

	onNoticeBannerChanged(next: NoticeBanner) {
		if (!this.isNewPage) {
			const request: IUpdateNoticeReq = {
				noticeId: this.pageId,
				noticeName: next.noticeName,
				bannerImageId: next.bannerImageId,
				bannerImageBlur: next.bannerImageBlur,
				bannerColor: next.bannerColor
			}

			if (request.bannerImageId) {
				delete request.bannerColor;
			} else {
				delete request.bannerImageId;
				delete request.bannerImageBlur;
			}

			this.dataService.updateNotice(request).toPromise().then(res => {
				if (res.status) {

				} else {

				}
			});
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

	isCourseMetaValid(e) {
		this.bannerMetaValid = e;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
