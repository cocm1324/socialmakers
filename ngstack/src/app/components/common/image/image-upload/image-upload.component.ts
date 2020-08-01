import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '@services/data/data.service';

const MAX_SIZE = 1024 * 1024 * 40;

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
	
	@Input() label: string = "Image Upload";
	@Input() icon: string = "pi pi-check";
	@Output() onSubmit = new EventEmitter();

	requestUrl: string = '/api/image';

	imageForm: FormGroup;
	error: string;
	uploadResponse = {
		status: '',
		message: '',
		filePath: ''
	};

	display: boolean = false;
	url: string = "";

	maxSize = MAX_SIZE;

	constructor(private fb: FormBuilder, private dataService: DataService) { }

	ngOnInit() {
		this.imageForm = this.fb.group({
			upload: ['']
		});
		this.uploadResponse = {
			status: '',
			message: '',
			filePath: ''
		};
	}

	showDialog() {
		this.display = true;
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.imageForm.get('upload').setValue(file);
		}
	}

	confirm() {
		const formData = new FormData();
		formData.append('upload', this.imageForm.get('upload').value);

		this.dataService.createImage(formData).toPromise().then(resolve => {
			if (resolve.status) {
				const response = {
					url: resolve.data.url,
					imageId: resolve.data.result.insertId
				};
				this.display = false;
				this.onSubmit.emit(response);
			} else {
				console.log(resolve.message);
			}
		}, reject => {
			console.log(reject);
		})
	}

	cancel() {
		this.display = false;
	}
}
