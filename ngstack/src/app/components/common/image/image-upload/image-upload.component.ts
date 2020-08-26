import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '@services/data/data.service';
import { IImage } from '@app/models/';

const MAX_SIZE = 1024 * 1024 * 40;

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, AfterViewInit {
	
	@Input() label: string = "Image Upload";
	@Input() icon: string = "pi pi-check";
	@Output() onSubmit = new EventEmitter();

	imageList: IImage[];
	curPage = 1;
	pageCount = 16;
	increment = false;
	rowCount;
	

	selectedImageId = -1;

	uploadedFiles = [];
	requestUrl: string = '/api/image';
	url: string = "";
	maxSize = MAX_SIZE;

	display: boolean = false;

	constructor(private fb: FormBuilder, private dataService: DataService) { }

	ngOnInit() {

	}

	ngAfterViewInit() {

	}

	loadImage() {
		this.dataService.getImageList(this.pageCount, this.curPage, this.increment).toPromise().then(res => {
			if (res.status) {
				this.imageList = res.data.images;
				this.rowCount = res.data.rowCount;
			}
		});
	}

	onUpload(e) {
		for(let file of e.files) {
            this.uploadedFiles.push(file);
		}
		this.curPage = 1;
		this.loadImage();
	}

	onPageChange(e) {
		const {page} = e;
		this.curPage = page + 1;
		this.loadImage();
	}

	showDialog() {
		this.loadImage();
		this.display = true;
	}

	confirm() {
		const response = {
			url: "",
			imageId: 0
		};
		console.log("confirm")
		// this.display = false;
		// this.onSubmit.emit(response);
	}

	cancel() {
		this.display = false;
	}
}
