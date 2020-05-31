import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

const MAX_SIZE = 1024 * 1024 * 20;

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
	
	@Input() label: string = "Image Upload"
	@Output() onSubmit = new EventEmitter()

	display: boolean = false;
	url: string = "";

	maxSize = MAX_SIZE;

	constructor() { }

	ngOnInit() {
	}

	showDialog() {
		this.display = true;
	}

	onUpload(event) {
		
	}

	confirm() {
		this.display = false;
		this.onSubmit.emit(this.url);
	}

	cancel() {
		this.display = false;
	}
}
