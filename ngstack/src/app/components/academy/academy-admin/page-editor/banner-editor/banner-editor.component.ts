import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-banner-editor',
	templateUrl: './banner-editor.component.html',
	styleUrls: ['./banner-editor.component.scss']
})
export class BannerEditorComponent implements OnInit {

	@Input() content: any;

    constructor() { }

    ngOnInit() {

    }
}
