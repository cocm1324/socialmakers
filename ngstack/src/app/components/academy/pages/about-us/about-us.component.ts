import { Component, OnInit } from '@angular/core';
import { ISection } from '@components/common/page/common';

const page = [
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_01.jpg"
	},
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_02.jpg"
	},
	{
		width: 0,
		type: 0,
		content: "./assets/img/about_us_03.png"
	}
]

@Component({
	selector: 'app-about-us',
	templateUrl: './about-us.component.html',
	styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

	page: ISection[];
	isEdit: boolean = false;

	constructor() { }

	ngOnInit() {
		this.page = page;
	}

	toggleEdit() {
		this.isEdit = !this.isEdit;
	}

	editFinished($event) {
		this.toggleEdit();

		if ($event) {
			this.page = $event;
		}
	}
}
