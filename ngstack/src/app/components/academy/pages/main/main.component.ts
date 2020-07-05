import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const carousel = [
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
]

const courses = [
	{
		id: 1,
		title: "웹디자인 기초과정 (HTML & CSS)",
		thumbnail: "./assets/img/3.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T19:20:30.45+09:00",
		updated: "2020-04-16T19:20:30.45+09:00"
	},
	{
		id: 2,
		title: "웹디자인 기본과정 (JavaScript)",
		thumbnail: "./assets/img/2.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T20:20:30.45+09:00",
		updated: "2020-04-16T20:20:30.45+09:00"
	},
	{
		id: 3,
		title: "웹디자인 응용과정 (Real Project)",
		thumbnail: "./assets/img/4.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T21:20:30.45+09:00",
		updated: "2020-04-16T21:20:30.45+09:00"
	},
	{
		id: 4,
		title: "3D 모델링 (Real Project)",
		thumbnail: "./assets/img/1.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T19:20:30.45+09:00",
		updated: "2020-04-16T19:20:30.45+09:00"
	},
	{
		id: 5,
		title: "아두이노 (Real Project)",
		thumbnail: "./assets/img/5.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T20:20:30.45+09:00",
		updated: "2020-04-16T20:20:30.45+09:00"
	},
	{
		id: 6,
		title: "영어와 코딩을 함께 공부하는 1:1 수업",
		thumbnail: "./assets/img/6.gif",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T20:20:30.45+09:00",
		updated: "2020-04-16T20:20:30.45+09:00"
	}
]

const courseCategory = [
	{
		id: 0,
		title: "웹디자인 과정",
		description: "창의적이고 실력있는 코딩 메이커가 되기 위한 웹 디자인 패키지"
	}
]

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	carousel;
	courseCategory;
	courses;

	constructor(
		private router: Router
	) { }

	ngOnInit() {
		this.carousel = carousel;
		this.courseCategory = courseCategory;
		this.courses = courses;
	}

	courseByCategory(id) {
		return this.courses.filter(elem => elem.category == id);
	}

	goToCourse(id) {
		this.router.navigate([`academy/courses/${id}`]);
	}
}
