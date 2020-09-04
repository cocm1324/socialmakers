import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import * as _ from 'lodash';
import { UtilService } from '@services/util/util.service';
import { ACADEMY_ADMIN_URL } from '@app/models/';

@Component({
	selector: 'app-main',
	templateUrl: './admin-main.component.html',
	styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

	courses;
	selectedCourseId = -1;

  	constructor(
		private router: Router, 
		private dataService: DataService,
		private utilService: UtilService,
	) { }

	ngOnInit() {
		this.loadCourse();
	}

	loadCourse() {
		this.dataService.getCourseList().toPromise().then((res) => {
			if (res.status) {
				this.courses = res.data.map(course => {
					const mappedCourse = {
						...course,
						thumbImageUrl: this.utilService.smallImage(course.thumbImageUrl)
					}
					return mappedCourse;
				});
				this.courses.sort((a, b)=> {
					const aVal = a.seq / a.seqBase;
					const bVal = b.seq / b.seqBase;

					if (aVal - bVal < 0) {
						return -1;
					}
					if (aVal - bVal > 0) {
						return 1;
					}
					return 0;
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
			this.dataService.deleteCourse(this.selectedCourseId).toPromise().then((response) => {
				if (response.status) {
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
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.COURSE_FRAGMANT}/${this.selectedCourseId}`]);
	}

	onCreateCourse() {
		this.router.navigate([`${ACADEMY_ADMIN_URL.PREFIX}/${ACADEMY_ADMIN_URL.NEW_COURSE}`]);
	}
}
