import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import { UtilService } from '@services/util/util.service';
import { ACADEMY_ADMIN_URL, INotice, IUpdateCourseThumbnailReq } from '@app/models/';
import * as _ from 'lodash';

@Component({
	selector: 'app-main',
	templateUrl: './admin-main.component.html',
	styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

	courses: any[];
	notices: INotice[];
	selectedCourseId = -1;

	displayNewCourseDialog: boolean = false;
	
	isCourseEdit: boolean = false;
	courseName: string = '';
	courseThumbImageId: number = null;
	courseThumbImageUrl: string = null;

	get newCourseValid() { return this.courseThumbImageId && this.courseName.length > 0 }

  	constructor(
		private router: Router, 
		private dataService: DataService,
		private utilService: UtilService,
	) { }

	ngOnInit() {
		this.loadCourse();
		this.loadNotice();
	}

	loadCourse() {
		this.dataService.getCourseList().toPromise().then(res => {
			if (res.status) {
				this.courses = res.data.map(course => {
					const mappedCourse = {
						...course,
						thumbImageUrl: this.utilService.smallImage(course.thumbImageUrl)
					}
					return mappedCourse;
				});
				this.courses.sort((bigger, smaller)=> {
					const biggerValue = bigger.seq / bigger.seqBase;
					const smallerValue = smaller.seq / smaller.seqBase;

					if (biggerValue < smallerValue) {
						return -1;
					}
					if (biggerValue > smallerValue) {
						return 1;
					}
					return 0;
				});
			} else {
				alert(`${res.error.code}: ${res.error.message}`);
			}
		});
	}

	loadNotice() {
		this.dataService.getNoticeList().toPromise().then(res => {
			if (res.status) {
				this.notices = res.data.notices;
				this.notices.sort((bigger, smaller) => {
					if (bigger.creationDateTime < smaller.creationDateTime) {
						return 1;
					} else {
						return -1;
					}
				});
			} else {
				alert(`${res.error.code}: ${res.error.message}`);
			}
		});
	}

	goToMain(e) {
		e.preventDefault();
		this.router.navigate([ACADEMY_ADMIN_URL.PREFIX]);
	}

  	goToEditAboutUs(e) {
		e.preventDefault();
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.ABOUT_US}`]);
	}

	onCourseDelete() {
		if (window.confirm("선택한 Course를 삭제하시겠습니까?")) {
			this.dataService.deleteCourse(this.selectedCourseId).toPromise().then((res) => {
				if (res.status) {
					this.selectedCourseId = -1;
					this.loadCourse();
				}
			});
		}
	}

	onCourseSelected(e) {	
		e.originalEvent ? e.originalEvent.preventDefault(): null;	
		this.selectedCourseId = e.value[0].courseId;
	}

	onCourseOrdered(e) {	
		console.log(e)
	}

	goToEditCourse(e) {
		e.preventDefault();
		if (this.selectedCourseId != -1) {
			this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.COURSE_FRAGMENT}/${this.selectedCourseId}`]);
		}
	}

	onCreateCourse() {
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NEW_COURSE}`]);
	}

	gotoEditNotice(noticeId) {
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NOTICE_FRAGMENT}/${noticeId}`]);
	}

	onCreateNotice() {
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NEW_NOTICE}`]);
	}

	onNewCourseThumbnailSelected(e) {
		const { url, imageId } = e;
		this.courseThumbImageId = imageId;
		this.courseThumbImageUrl = url;
	}

	initializeCourseInfo() {
		this.isCourseEdit = false;
		this.displayNewCourseDialog = false;
		this.courseName = '';
		this.courseThumbImageId = null;
		this.courseThumbImageUrl = null;
	}

	openCourseThumbnailEditDialog() {
		if (this.selectedCourseId != -1) {
			const { courseName, thumbImageId, thumbImageUrl } = this.courses.filter(element => element.courseId == this.selectedCourseId)[0];
			this.isCourseEdit = true;
			this.courseName = courseName;
			this.courseThumbImageId = thumbImageId;
			this.courseThumbImageUrl = thumbImageUrl;
			this.displayNewCourseDialog = true;
		}
	}

	createNewCourse() {
		if (this.newCourseValid) {
			this.dataService.createCourse({
				courseName: this.courseName,
				thumbImageId: this.courseThumbImageId
			}).toPromise().then(result => {
				if (!result) {
					alert('생성 실패');
					return;
				} else {
					alert('새 Course가 생성되었습니다');
					this.initializeCourseInfo();
					this.loadCourse();
				}
			}).catch(error => {
				alert('생성 실패:' + error);
			});
		}
	}

	updateCourseThumbnail() {
		const request: IUpdateCourseThumbnailReq = {
			courseId: this.selectedCourseId,
			courseName: this.courseName,
			thumbnailImageId: this.courseThumbImageId
		};
		this.dataService.updateCourseThumbnail(request).toPromise().then(result => {
			if (!result || !result.status) {
				alert('실패하였습니다.');
				return;
			}
			this.initializeCourseInfo();
			this.loadCourse();
		});
	}
}
