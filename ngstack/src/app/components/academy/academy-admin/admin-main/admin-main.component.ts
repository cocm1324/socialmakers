import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-main',
	templateUrl: './admin-main.component.html',
	styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

  	constructor(private router: Router) { }

	ngOnInit() {
	}

  	goToEditAboutUs(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin/pageEditor/aboutUs']);
	}
}
