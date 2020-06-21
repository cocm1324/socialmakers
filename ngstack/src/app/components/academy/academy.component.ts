import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_TYPE } from '@app/models';

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
		// this.router.navigate(['']);
	}

	goToAboutUs() {
		this.router.navigate(['academy/aboutUs']);
		// this.router.navigate(['aboutUs']);
	}

	goToReview() {
		this.router.navigate(['academy/review']);
		// this.router.navigate(['review']);
	}

	goToNotice() {
		this.router.navigate(['academy/notice']);
		// this.router.navigate(['notice']);
	}

	goToAdmin(e) {
		e.preventDefault();
		const url = 'academy/admin';

		localStorage.setItem(LOCAL_STORAGE_TYPE.CALLBACK, url)
		this.router.navigate([url]);
	}

	event(e) {
		console.log(e);
	}
}
