import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-main',
	templateUrl: './admin-main.component.html',
	styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

	courses;
	selectedCourseId = -1;

  	constructor(private router: Router, private dataService: DataService) { }

	ngOnInit() {
		this.loadCourse();
	}

	loadCourse() {
		this.dataService.getCourseList().toPromise().then((res) => {
			if (res.status) {
				this.courses = res.data;
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
		this.router.navigate(['academy/admin/pageEditor/aboutUs/page']);
	}

	onCourseSelected(e) {
		e.originalEvent ? e.originalEvent.preventDefault(): null;
		this.selectedCourseId = e.value[0].courseId;
	}

	onCourseOrdered(e) {
		if (this.courses && this.courses.length > 1) {
			const index = this.courses.map(elem => elem.courseId).indexOf(this.selectedCourseId);

			const request = {
				courseId: this.selectedCourseId,
				seq: -1,
				seqBase: -1
			}

			if (index == 0 && this.courses.length > 1) {
				request.seq = this.courses[1].seq;
				request.seqBase = this.courses[1].seqBase + 1;
			} else if (this.courses.length > 1 && index == this.courses.length - 1) {
				request.seq = Math.floor(this.courses[index - 1].seq / this.courses[index - 1].seqBase) + 1;
				request.seqBase = 1;
			} else {
				request.seq = this.courses[index - 1].seq + this.courses[index + 1].seq;
				request.seqBase = this.courses[index - 1].seqBase + this.courses[index + 1].seqBase;
			}

			this.dataService.updateCourseSeq(request).toPromise().then((response) => {
				if (response.status) {
					this.selectedCourseId = -1;
					this.loadCourse();
				}
			});
		}
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
}
