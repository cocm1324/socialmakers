import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const courses = [
	{
		title: "웹디자인 기초과정 (HTML & CSS)",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T19:20:30.45+09:00",
		updated: "2020-04-16T19:20:30.45+09:00"
	},
	{
		title: "웹디자인 기본과정 (JavaScript)",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T20:20:30.45+09:00",
		updated: "2020-04-16T20:20:30.45+09:00"
	},
	{
		title: "웹디자인 응용과정 (Real Project)",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 0,
		created: "2020-04-16T21:20:30.45+09:00",
		updated: "2020-04-16T21:20:30.45+09:00"
	},
	{
		title: "영어와 코딩을 함께 공부하는 1:1 수업",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 1,
		created: "2020-04-16T20:20:30.45+09:00",
		updated: "2020-04-16T20:20:30.45+09:00"
	},
	{
		title: "2020 AP Computer Science 시험대비 실전완성반",
		description: "It is a long established fact that a reader will be distracted by the readabl",
		category: 2,
		created: "2020-04-17T20:20:30.45+09:00",
		updated: "2020-04-17T20:20:30.45+09:00"
	}
]

const courseCategory = [
	{
		id: 0,
		title: "웹디자인 과정",
		description: "창의적이고 실력있는 코딩 메이커가 되기 위한 웹 디자인 패키지"
	},
	{
		id: 1,
		title: "1:1 영어와 코딩을 함께하는 CLASS",
		description: "영어가 자신 없는 수강생들을 위한 코딩과 영어공부를 함께하는 1:1 CLASS"
	},
	{
		id: 2,
		title: "AP Computer Science",
		description: "프로그램 디자인, 쓰기, 분석 및 문서화 할 수 있는 능력을 테스트하는 AP Computer Science 시험 대비반"
	}
]

const page = [
	{
		width: 2,
		type: 0,
		content: "https://cdn.vox-cdn.com/thumbor/fX2H2kXoVxztcgbEsZruISsjO9s=/0x0:2040x1360/1720x0/filters:focal(0x0:2040x1360):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/15987610/vpavic_190322_3297_0030.jpg"
	},
	{
		width: 0,
		type: 1,
		content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
		width: 1,
		type: 0,
		content: "https://miro.medium.com/max/1400/1*t6Dd-hq4lTm1-ooyBP6vDw.jpeg"
	},
	{
		width: 0,
		type: 1,
		content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	},
]

@Component({
	selector: 'app-academy',
	templateUrl: './academy.component.html',
	styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit {

	constructor(
		private router: Router
	) { }

	ngOnInit() {}

	goToMain() {
		this.router.navigate(['academy']);
	}

	goToAboutUs() {
		this.router.navigate(['academy/aboutUs']);
	}

	goToReview() {
		this.router.navigate(['academy/review']);
	}

	goToNotice() {
		this.router.navigate(['academy/notice']);
	}

	event(e) {
		console.log(e);
	}
}
