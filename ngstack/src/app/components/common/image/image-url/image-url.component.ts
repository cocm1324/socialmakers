import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'app-image-url',
	templateUrl: './image-url.component.html',
	styleUrls: ['./image-url.component.scss']
})
export class ImageUrlComponent implements OnInit {

	@Input() label: string = "Image URL";
	@Input() initialValue: string = "";
	@Output() onSubmit: EventEmitter<string> = new EventEmitter();

	display: boolean = false;
	url: string = "";

	constructor() { }

	ngOnInit() {
	}

	showDialog() {
		this.display = true;
		this.url = this.initialValue;
	}

	confirm() {
		this.display = false;
		this.onSubmit.emit(this.url);
	}

	cancel() {
		this.display = false;
	}
}
