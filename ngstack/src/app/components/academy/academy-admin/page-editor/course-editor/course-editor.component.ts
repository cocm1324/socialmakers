import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICourseInfo, DATA_LENGTH, BANNER_TYPE, CourseBanner, DELAY_TYPE, CourseMeta } from '@app/models/';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, take } from 'rxjs/operators';
import { PageEditorService } from '../page-editor.service';

@Component({
	selector: 'app-course-editor',
	templateUrl: './course-editor.component.html',
	styleUrls: ['./course-editor.component.scss']
})
export class CourseEditorComponent implements OnInit, OnDestroy {

	@Input() course: CourseMeta;
	@Output() onEdit: EventEmitter<CourseMeta> = new EventEmitter();
	@Output() valid: EventEmitter<boolean> = new EventEmitter();

	dataLength = DATA_LENGTH;

	urlEdit: boolean = false;

	courseForm: FormGroup;

	subscriptions: Subscription[] = [];

	get courseName() {return this.courseForm.get('courseName')}
	get description1() {return this.courseForm.get('description1')}
	get description2() {return this.courseForm.get('description2')}
	get fieldTitle1() {return this.courseForm.get('fieldTitle1')}
	get fieldTitle2() {return this.courseForm.get('fieldTitle2')}
	get fieldTitle3() {return this.courseForm.get('fieldTitle3')}
	get fieldTitle4() {return this.courseForm.get('fieldTitle4')}
	get fieldTitle5() {return this.courseForm.get('fieldTitle5')}
	get fieldTitle6() {return this.courseForm.get('fieldTitle6')}
	get field1() {return this.courseForm.get('field1')}
	get field2() {return this.courseForm.get('field2')}
	get field3() {return this.courseForm.get('field3')}
	get field4() {return this.courseForm.get('field4')}
	get field5() {return this.courseForm.get('field5')}
	get field6() {return this.courseForm.get('field6')}
	get registerUrl() {return this.courseForm.get('registerUrl')}

	constructor(
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.initializeForm();
		this.registerFormValueChange();
		const a = this.courseForm.statusChanges.subscribe(next => {
			if (next === 'INVALID') {
				this.valid.emit(false);
			} else {
				this.valid.emit(true);
			}
		});
		this.subscriptions.push(a);
	}

	initializeForm() {
		if (this.course) {
			const { 
				courseName, description1, description2, fieldTitle1, fieldTitle6, fieldTitle5,
				fieldTitle4, fieldTitle3, fieldTitle2, field6, field5, field4, field3, field2,
				field1, registerUrl
			} = this.course;

			this.courseForm = this.fb.group({
				courseName: [courseName, Validators.required], description1, description2, 
				fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
				field1, field2, field3, field4, field5, field6, registerUrl
			});
		} else {
			this.courseForm = this.fb.group({
				courseName: ["", Validators.required], description1: "", 
				description2: "", fieldTitle1: "", fieldTitle2: "", fieldTitle3: "", 
				fieldTitle4: "", fieldTitle5: "", fieldTitle6: "", field1: "", field2: "", 
				field3: "", field4: "", field5: "", field6: "", registerUrl: ""
			});
		}
	}


	registerFormValueChange() {
		const courseChange = this.courseForm.valueChanges.pipe(
			skip(1),
			distinctUntilChanged(),
			debounceTime(DELAY_TYPE.MEDIUM)
		).subscribe(nextCourse => {
			const {
				courseName, description1, description2, field1, field2, field3, field4, field5, field6,
				fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
			} = <CourseBanner>nextCourse;
			// const current = this.pageEditorService.getBanner().pipe(
			// 	take(1)
			// ).subscribe(nextBanner => {
			// 	const courseBanner: CourseBanner = {
			// 		...nextBanner,
			// 		courseName: courseName,
			// 		description1: description1,
			// 		description2: description2,
			// 		fieldTitle1: fieldTitle1,
			// 		fieldTitle2: fieldTitle2,
			// 		fieldTitle3: fieldTitle3,
			// 		fieldTitle4: fieldTitle4,
			// 		fieldTitle5: fieldTitle5,
			// 		fieldTitle6: fieldTitle6,
			// 		field1: field1,
			// 		field2: field2,
			// 		field3: field3,
			// 		field4: field4,
			// 		field5: field5,
			// 		field6: field6,
			// 		registerUrl: registerUrl
			// 	};
			// 	this.pageEditorService.nextBanner(courseBanner);
			// });
			// this.subscriptions.push(current);

			this.onEdit.emit({
				courseName, description1, description2, field1, field2, field3, field4, field5, field6,
				fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, registerUrl
			});
		});
		this.subscriptions.push(courseChange);
	}

	toggleUrl() {
		this.urlEdit = !this.urlEdit;
	}

	completeUrl(e) {
		if (e && (e.which == 13 || e.which == 27)) {
			this.toggleUrl();
		}
	}
	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
