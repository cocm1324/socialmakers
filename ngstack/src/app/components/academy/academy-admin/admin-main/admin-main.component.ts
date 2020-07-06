import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const course = [
	{
		pageName: "fqojerwg"
	},
	{
		pageName: "fqoje124rwg"
	},
	{
		pageName: "f1623qojerwg"
	}
]

@Component({
	selector: 'app-main',
	templateUrl: './admin-main.component.html',
	styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

	courses;

  	constructor(private router: Router) { }

	ngOnInit() {
		this.courses = course;
	}

  	goToEditAboutUs(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin/pageEditor/aboutUs']);
	}
}
