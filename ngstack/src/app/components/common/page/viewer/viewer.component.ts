import { Component, OnInit, Input } from '@angular/core';
import { ISection } from '@app/models';

@Component({
	selector: 'ple-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

	@Input() pageData: ISection[];

	constructor() { }

	ngOnInit() {
		
	}
}
