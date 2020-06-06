import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
		// this.router.navigate(['academy']);
		this.router.navigate(['']);
	}

	goToAboutUs() {
		// this.router.navigate(['aboutUs']);
		this.router.navigate(['aboutUs']);
	}

	goToReview() {
		// this.router.navigate(['academy/review']);
		this.router.navigate(['review']);
	}

	goToNotice() {
		// this.router.navigate(['academy/notice']);
		this.router.navigate(['notice']);
	}

	event(e) {
		console.log(e);
	}
}
