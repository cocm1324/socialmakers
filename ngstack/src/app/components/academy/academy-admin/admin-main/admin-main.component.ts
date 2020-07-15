import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';

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
		this.dataService.getCourseList().toPromise().then((res) => {
			if (res.status) {
				this.courses = res.data;
			} else {
				alert(`${res.error.code}: ${res.error.message}`);
			}
		});
	}

  	goToEditAboutUs(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin/pageEditor/aboutUs']);
	}

	onCourseSelected(e) {
		e.originalEvent ? e.originalEvent.preventDefault(): null;
		this.selectedCourseId = e.value[0].courseId;
	}

	onCourseOrdered(e) {
		console.log(e)
		console.log(this.courses);
	}

	goToEditCourse(e) {
		e.preventDefault();
		this.router.navigate([`academy/admin/pageEditor/course/${this.selectedCourseId}`]);
	}
}
