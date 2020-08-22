import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import * as _ from 'lodash';
import { FormBuilder } from '@angular/forms';
import { UtilService } from '@services/util/util.service';

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
		private fb: FormBuilder
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
		this.router.navigate(['academy/admin']);
	}

  	goToEditAboutUs(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin/pageEditor/aboutUs']);
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

	goToEditCourse(e) {
		e.preventDefault();
		this.router.navigate([`academy/admin/pageEditor/course/${this.selectedCourseId}`]);
	}

	onCreateCourse() {
		this.router.navigate([`academy/admin/pageEditor/course/new`]);
	}
}
