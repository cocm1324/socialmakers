import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICourseInfo, DATA_LENGTH } from '@app/models/';

@Component({
	selector: 'app-course-editor',
	templateUrl: './course-editor.component.html',
	styleUrls: ['./course-editor.component.scss']
})
export class CourseEditorComponent implements OnInit {

	@Input() courseInfoData: ICourseInfo;
	@Input() disabledByParent: boolean;
	@Input() isNewPage: boolean = false;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<ICourseInfo> = new EventEmitter();

	dataLength = DATA_LENGTH;

	courseInfoForm: FormGroup;
	isEdit: boolean = false;
	lock: boolean = false;

	get cCourseName() {return this.courseInfoForm.get('cCourseName');}
	get cDescription1() {return this.courseInfoForm.get('cDescription1');}
	get cDescription2() {return this.courseInfoForm.get('cDescription2');}
	get cFieldTitle1() {return this.courseInfoForm.get('cFieldTitle1');}
	get cFieldTitle2() {return this.courseInfoForm.get('cFieldTitle2');}
	get cFieldTitle3() {return this.courseInfoForm.get('cFieldTitle3');}
	get cFieldTitle4() {return this.courseInfoForm.get('cFieldTitle4');}
	get cFieldTitle5() {return this.courseInfoForm.get('cFieldTitle5');}
	get cFieldTitle6() {return this.courseInfoForm.get('cFieldTitle6');}
	get cField1() {return this.courseInfoForm.get('cField1');}
	get cField2() {return this.courseInfoForm.get('cField2');}
	get cField3() {return this.courseInfoForm.get('cField3');}
	get cField4() {return this.courseInfoForm.get('cField4');}
	get cField5() {return this.courseInfoForm.get('cField5');}
	get cField6() {return this.courseInfoForm.get('cField6');}
	get cBannerImageId() {return this.courseInfoForm.get('cBannerImageId');}
	get cBannerImageUrl() {return this.courseInfoForm.get('cBannerImageUrl');}
	get cThumbImageId() {return this.courseInfoForm.get('cThumbImageId');}
	get cThumbImageUrl() {return this.courseInfoForm.get('cThumbImageUrl');}
	get cRegisterUrl() {return this.courseInfoForm.get('cRegisterUrl');}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		console.log(this.courseInfoData, this.isNewPage);

		this.courseInfoForm = this.fb.group({
			cCourseName: ["", Validators.required],
			cDescription1: ["", Validators.required],
			cDescription2: ["", Validators.required],
			cFieldTitle1: ["", Validators.required],
			cFieldTitle2: ["", Validators.required],
			cFieldTitle3: ["", Validators.required],
			cFieldTitle4: ["", Validators.required],
			cFieldTitle5: ["", Validators.required],
			cFieldTitle6: ["", Validators.required],
			cField1: ["", Validators.required],
			cField2: ["", Validators.required],
			cField3: ["", Validators.required],
			cField4: ["", Validators.required],
			cField5: ["", Validators.required],
			cField6: ["", Validators.required],
			cBannerImageId: [null, Validators.required],
			cBannerImageUrl: ["", Validators.required],
			cThumbImageId: [null, Validators.required],
			cThumbImageUrl: ["", Validators.required],
			cRegisterUrl: ["", Validators.required]
		});

		if (this.isNewPage) {
			this.isEdit = true;
		} else {
			this.mapFormControls();
		}
		this.onEditStateChange.emit(this.isEdit);
	}

	ngOnChanges() {
		if (this.disabledByParent != null && this.disabledByParent != undefined) {
			if (this.disabledByParent) {
				this.lock = true;
			} else {
				this.lock = false;
			}
		}
	}
	
	pageImageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.cBannerImageUrl.patchValue(url);
			this.cBannerImageId.patchValue(imageId);
		}
	}

	thumbImageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.cThumbImageUrl.patchValue(url);
			this.cThumbImageId.patchValue(imageId);
		}
	}

	isChanged() {
		if (!this.courseInfoData) {
			return true;
		}

		const {
			cCourseName,
			cDescription1,
			cDescription2,
			cFieldTitle1,
			cFieldTitle2,
			cFieldTitle3,
			cFieldTitle4,
			cFieldTitle5,
			cFieldTitle6,
			cField1,
			cField2,
			cField3,
			cField4,
			cField5,
			cField6,
			cBannerImageId,
			cBannerImageUrl,
			cThumbImageId,
			cThumbImageUrl,
			cRegisterUrl
		} = this.courseInfoForm.getRawValue();

		return cCourseName !== this.courseInfoData.courseName 
			|| cDescription1 !== this.courseInfoData.description1 
			|| cDescription2 !== this.courseInfoData.description2 
			|| cFieldTitle1 !== this.courseInfoData.fieldTitle1
			|| cFieldTitle2 !== this.courseInfoData.fieldTitle2
			|| cFieldTitle3 !== this.courseInfoData.fieldTitle3
			|| cFieldTitle4 !== this.courseInfoData.fieldTitle4
			|| cFieldTitle5 !== this.courseInfoData.fieldTitle5
			|| cFieldTitle6 !== this.courseInfoData.fieldTitle6
			|| cField1 !== this.courseInfoData.field1
			|| cField2 !== this.courseInfoData.field2
			|| cField3 !== this.courseInfoData.field3
			|| cField4 !== this.courseInfoData.field4
			|| cField5 !== this.courseInfoData.field5
			|| cField6 !== this.courseInfoData.field6
			|| cBannerImageId !== this.courseInfoData.bannerImageId
			|| cBannerImageUrl !== this.courseInfoData.bannerImageUrl
			|| cThumbImageId !== this.courseInfoData.thumbImageId
			|| cThumbImageUrl !== this.courseInfoData.thumbImageUrl
			|| cRegisterUrl !== this.courseInfoData.registerUrl;
	}

	mapFormControls() {
		if (this.courseInfoData) {
			this.courseInfoForm.patchValue({
				cCourseName: this.courseInfoData.courseName,
				cDescription1: this.courseInfoData.description1,
				cDescription2: this.courseInfoData.description2,
				cFieldTitle1: this.courseInfoData.fieldTitle1,
				cFieldTitle2: this.courseInfoData.fieldTitle2,
				cFieldTitle3: this.courseInfoData.fieldTitle3,
				cFieldTitle4: this.courseInfoData.fieldTitle4,
				cFieldTitle5: this.courseInfoData.fieldTitle5,
				cFieldTitle6: this.courseInfoData.fieldTitle6,
				cField1: this.courseInfoData.field1,
				cField2: this.courseInfoData.field2,
				cField3: this.courseInfoData.field3,
				cField4: this.courseInfoData.field4,
				cField5: this.courseInfoData.field5,
				cField6: this.courseInfoData.field6,
				cBannerImageId: this.courseInfoData.bannerImageId,
				cBannerImageUrl: this.courseInfoData.bannerImageUrl,
				cThumbImageId: this.courseInfoData.thumbImageId,
				cThumbImageUrl: this.courseInfoData.thumbImageUrl,
				cRegisterUrl: this.courseInfoData.registerUrl
			});
		}
	}

	edit() {
		this.isEdit = true;
		this.onEditStateChange.emit(this.isEdit);
	}

	save() {
		if (this.isChanged()) {
			const formData: ICourseInfo = {
				courseName: this.cCourseName.value,
				description1: this.cDescription1.value,
				description2: this.cDescription2.value,
				field1: this.cField1.value,
				field2: this.cField2.value,
				field3: this.cField3.value,
				field4: this.cField4.value,
				field5: this.cField5.value,
				field6: this.cField6.value,
				fieldTitle1: this.cFieldTitle1.value,
				fieldTitle2: this.cFieldTitle2.value,
				fieldTitle3: this.cFieldTitle3.value,
				fieldTitle4: this.cFieldTitle4.value,
				fieldTitle5: this.cFieldTitle5.value,
				fieldTitle6: this.cFieldTitle6.value,
				bannerImageId: this.cBannerImageId.value,
				bannerImageUrl: this.cBannerImageUrl.value,
				thumbImageId: this.cThumbImageId.value,
				thumbImageUrl: this.cThumbImageUrl.value,
				registerUrl: this.cRegisterUrl.value
			};
			this.onFinish.emit(formData);
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		} else {
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		}
	}

	cancel() {
		if (this.isChanged()) {
			if (confirm("변경사항을 저장하지 않고 수정을 끝내시겠습니까?")) {
				this.mapFormControls();
				this.isEdit = false;
				this.onEditStateChange.emit(this.isEdit);
			}
		} else {
			this.isEdit = false;
			this.onEditStateChange.emit(this.isEdit);
		}
	}
}
