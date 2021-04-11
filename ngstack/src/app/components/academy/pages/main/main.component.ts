import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services/data/data.service';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	carousel = [
		{
			id: 427,
			title: "웹프로그래밍 기초부터 실전까지!",
			description: "걸음마부터 시작해 내 손으로 직접 제작하는 웹페이지 디자인 과정 START!"
		},
		{
			id: 227,
			title: "Test2",
			description: "qjwgeijqweippjwqjpiwqgjipg ewiqjofwjei oijiojpfeqioj wfe"
		},
		{
			id: 127,
			title: "Test3",
			description: "jgiewqiopjgiqwepgj egijfqgopi qiwoj wejqgpijgqiweg piqwipjp qwjepgiqw ejgpi jqweijpg"
		}
	];
	courseCategory = [
		{
			id: 0,
			title: "웹디자인 과정",
			description: "창의적이고 실력있는 코딩 메이커가 되기 위한 웹 디자인 패키지"
		}
	];
	courses: Array<{
        courseId: number;
        courseName: string;
        thumbImageId: number;
		thumbImageUrl: string;
		description1: string;
        seq: number;
        seqBase: number;
    }>;

	constructor(
		private router: Router,
		private dataService: DataService
	) { }

	ngOnInit() {
		this.loadCourse();
	}

	loadCourse() {
		this.dataService.getCourseList().toPromise().then(result => {
			const { data, status } = result;
			if (status) {
				this.courses = data;
			}
		});
	}

	// courseByCategory(id) {
	// 	return this.courses.filter(elem => elem.category == id);
	// }

	goToCourse(id) {
		this.router.navigate([`academy/courses/${id}`]);
	}
}
