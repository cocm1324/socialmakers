import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICourseInfo, DATA_LENGTH, BANNER_TYPE } from '@app/models/';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-course-editor',
	templateUrl: './course-editor.component.html',
	styleUrls: ['./course-editor.component.scss']
})
export class CourseEditorComponent implements OnInit, OnDestroy {

	@Input() courseInfoData: ICourseInfo;
	@Input() disabledByParent: boolean;
	@Input() isNewPage: boolean = false;
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();
	@Output() onFinish: EventEmitter<ICourseInfo> = new EventEmitter();

	dataLength = DATA_LENGTH;
	bannerTypes = [
		{label: "이미지", value: BANNER_TYPE.IMAGE}, 
		{label: "단색", value: BANNER_TYPE.COLOR}
	];

	courseInfoForm: FormGroup;
	isEdit: boolean = false;
	lock: boolean = false;

	subscription: Subscription[] = [];

	get courseName() {return this.courseInfoForm.get('courseName');}
	get description1() {return this.courseInfoForm.get('description1');}
	get description2() {return this.courseInfoForm.get('description2');}
	get fieldTitle1() {return this.courseInfoForm.get('fieldTitle1');}
	get fieldTitle2() {return this.courseInfoForm.get('fieldTitle2');}
	get fieldTitle3() {return this.courseInfoForm.get('fieldTitle3');}
	get fieldTitle4() {return this.courseInfoForm.get('fieldTitle4');}
	get fieldTitle5() {return this.courseInfoForm.get('fieldTitle5');}
	get fieldTitle6() {return this.courseInfoForm.get('fieldTitle6');}
	get field1() {return this.courseInfoForm.get('field1');}
	get field2() {return this.courseInfoForm.get('field2');}
	get field3() {return this.courseInfoForm.get('field3');}
	get field4() {return this.courseInfoForm.get('field4');}
	get field5() {return this.courseInfoForm.get('field5');}
	get field6() {return this.courseInfoForm.get('field6');}
	get bannerImageId() {return this.courseInfoForm.get('bannerImageId');}
	get bannerImageUrl() {return this.courseInfoForm.get('bannerImageUrl');}
	get thumbImageId() {return this.courseInfoForm.get('thumbImageId');}
	get thumbImageUrl() {return this.courseInfoForm.get('thumbImageUrl');}
	get registerUrl() {return this.courseInfoForm.get('registerUrl');}

	get bannerType() {return this.courseInfoForm.get('bannerType');}
	get bannerImageBlur() {return this.courseInfoForm.get('bannerImageBlur');}
	get bannerColor() {return this.courseInfoForm.get('bannerColor');}
	get blurValue() {return `blur(${this.bannerImageBlur.value}px) opacity(80%)`;}

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.courseInfoForm = this.fb.group({
			courseName: ["", Validators.required],
			description1: ["", Validators.required],
			description2: ["", Validators.required],
			fieldTitle1: ["", Validators.required],
			fieldTitle2: ["", Validators.required],
			fieldTitle3: ["", Validators.required],
			fieldTitle4: ["", Validators.required],
			fieldTitle5: ["", Validators.required],
			fieldTitle6: ["", Validators.required],
			field1: ["", Validators.required],
			field2: ["", Validators.required],
			field3: ["", Validators.required],
			field4: ["", Validators.required],
			field5: ["", Validators.required],
			field6: ["", Validators.required],
			bannerImageId: [null, Validators.required],
			bannerImageUrl: [""],
			bannerImageBlur: [0],
			bannerType: [this.bannerTypes[0].value],
			bannerColor: ["#ffffff"],
			thumbImageId: [null, Validators.required],
			thumbImageUrl: [""],
			registerUrl: ["", Validators.required]
		});

		const bannerTypeChange = this.bannerType.valueChanges.subscribe(value => {
			if (this.isImage()) {
				this.bannerImageId.setValidators(Validators.required);
				this.bannerImageId.updateValueAndValidity();
			} else {
				this.bannerImageId.clearValidators();
				this.bannerImageId.updateValueAndValidity();
			}
		});

		this.subscription.push(bannerTypeChange);

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
	
	isImage() {
		return this.bannerType.value == this.bannerTypes[0].value;
	}

	bannerImageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.bannerImageUrl.patchValue(url);
			this.bannerImageId.patchValue(imageId);
		}
	}

	thumbImageUploaded(e) {
		const {url, imageId} = e;
		
		if (url && imageId) {
			this.thumbImageUrl.patchValue(url);
			this.thumbImageId.patchValue(imageId);
		}
	}

	isChanged() {
		if (!this.courseInfoData) {
			return true;
		}

		const {
			courseName,
			description1,
			description2,
			fieldTitle1,
			fieldTitle2,
			fieldTitle3,
			fieldTitle4,
			fieldTitle5,
			fieldTitle6,
			field1,
			field2,
			field3,
			field4,
			field5,
			field6,
			bannerImageId,
			bannerImageUrl,
			bannerImageBlur,
			bannerColor,
			thumbImageId,
			thumbImageUrl,
			registerUrl
		} = this.courseInfoForm.getRawValue();

		if (!this.courseInfoData.bannerColor == this.isImage()) {
			return true;
		}

		const dataChanged = courseName !== this.courseInfoData.courseName 
			|| description1 !== this.courseInfoData.description1 
			|| description2 !== this.courseInfoData.description2 
			|| fieldTitle1 !== this.courseInfoData.fieldTitle1
			|| fieldTitle2 !== this.courseInfoData.fieldTitle2
			|| fieldTitle3 !== this.courseInfoData.fieldTitle3
			|| fieldTitle4 !== this.courseInfoData.fieldTitle4
			|| fieldTitle5 !== this.courseInfoData.fieldTitle5
			|| fieldTitle6 !== this.courseInfoData.fieldTitle6
			|| field1 !== this.courseInfoData.field1
			|| field2 !== this.courseInfoData.field2
			|| field3 !== this.courseInfoData.field3
			|| field4 !== this.courseInfoData.field4
			|| field5 !== this.courseInfoData.field5
			|| field6 !== this.courseInfoData.field6
			|| bannerImageId !== this.courseInfoData.bannerImageId
			|| bannerImageUrl !== this.courseInfoData.bannerImageUrl
			|| bannerImageBlur != this.courseInfoData.bannerImageBlur
			|| thumbImageId !== this.courseInfoData.thumbImageId
			|| thumbImageUrl !== this.courseInfoData.thumbImageUrl
			|| registerUrl !== this.courseInfoData.registerUrl;
		
		const bannerChanged = this.isImage() ? bannerImageId !== this.courseInfoData.bannerImageId
		|| bannerImageUrl !== this.courseInfoData.bannerImageUrl
		|| bannerImageBlur != this.courseInfoData.bannerImageBlur :
		bannerColor !== this.courseInfoData.bannerColor;

		return dataChanged || bannerChanged;
	}

	mapFormControls() {
		if (this.courseInfoData) {
			const {
				courseName, thumbImageId, thumbImageUrl, registerUrl,
				bannerColor, bannerImageBlur, bannerImageId, bannerImageUrl, 
				description1, description2, field1, field2, field3, field4, field5, field6, 
				fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6
			} = this.courseInfoData;

			this.courseInfoForm.patchValue({
				courseName: courseName,
				description1: description1,
				description2: description2,
				fieldTitle1: fieldTitle1,
				fieldTitle2: fieldTitle2,
				fieldTitle3: fieldTitle3,
				fieldTitle4: fieldTitle4,
				fieldTitle5: fieldTitle5,
				fieldTitle6: fieldTitle6,
				field1: field1,
				field2: field2,
				field3: field3,
				field4: field4,
				field5: field5,
				field6: field6,
				thumbImageId: thumbImageId,
				thumbImageUrl: thumbImageUrl,
				registerUrl: registerUrl
			});

			if (bannerColor) {
				this.bannerType.patchValue(this.bannerTypes[1].value);
				this.bannerColor.patchValue(bannerColor);
			} else {
				this.bannerImageId.patchValue(bannerImageId);
				this.bannerImageUrl.patchValue(bannerImageUrl);
				this.bannerImageBlur.patchValue(bannerImageBlur);
			}
		}
	}

	edit() {
		this.isEdit = true;
		this.onEditStateChange.emit(this.isEdit);
	}

	save() {
		if (this.isChanged()) {
			const formData: ICourseInfo = {
				courseName: this.courseName.value,
				description1: this.description1.value,
				description2: this.description2.value,
				field1: this.field1.value,
				field2: this.field2.value,
				field3: this.field3.value,
				field4: this.field4.value,
				field5: this.field5.value,
				field6: this.field6.value,
				fieldTitle1: this.fieldTitle1.value,
				fieldTitle2: this.fieldTitle2.value,
				fieldTitle3: this.fieldTitle3.value,
				fieldTitle4: this.fieldTitle4.value,
				fieldTitle5: this.fieldTitle5.value,
				fieldTitle6: this.fieldTitle6.value,
				bannerImageId: this.bannerImageId.value,
				bannerImageBlur: this.bannerImageBlur.value,
				thumbImageId: this.thumbImageId.value,
				registerUrl: this.registerUrl.value
			};
			if (!this.isImage()) {
				formData['bannerColor'] = this.bannerColor.value;
				delete formData.bannerImageId;
				delete formData.bannerImageBlur;
			}
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

	ngOnDestroy() {
		this.subscription.forEach(elem => {
			elem.unsubscribe();
		});
	}
}
