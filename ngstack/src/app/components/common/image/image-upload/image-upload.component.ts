import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
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

	selectedImage: IImage = {
		imageId: -1,
		url: "",
		fileName: ""
	};

	uploadedFiles = [];
	requestUrl: string = '/api/image';
	url: string = "";
	maxSize = MAX_SIZE;

	display: boolean = false;

	constructor(private dataService: DataService) { }

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

	onImageClick(image) {
		this.selectedImage = image;
	}

	onUpload(e) {
		this.curPage = 1;
		this.dataService.getImageList(this.pageCount, this.curPage, this.increment).toPromise().then(res => {
			if (res.status) {
				this.imageList = res.data.images;
				this.rowCount = res.data.rowCount;
				
				if (this.imageList.length > 0) {
					this.selectedImage = this.imageList[0];
				}
			}
		});
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
			url: this.selectedImage.url,
			imageId: this.selectedImage.imageId
		};
		this.display = false;
		this.onSubmit.emit(response);
	}

	cancel() {
		this.display = false;
	}
}
