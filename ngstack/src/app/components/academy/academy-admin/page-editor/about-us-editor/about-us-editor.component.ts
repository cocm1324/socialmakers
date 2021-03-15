import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DATA_LENGTH, AboutUsBanner, DELAY_TYPE, AboutUsMeta } from '@app/models';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, take } from 'rxjs/operators';
import { PageEditorService } from '../page-editor.service';

@Component({
	selector: 'app-about-us-editor',
	templateUrl: './about-us-editor.component.html',
	styleUrls: ['./about-us-editor.component.scss']
})
export class AboutUsEditorComponent implements OnInit, OnDestroy {

	@Input() aboutUs: AboutUsMeta;
	@Output() onEdit: EventEmitter<AboutUsMeta> = new EventEmitter();

	dataLength = DATA_LENGTH;

	aboutUsForm: FormGroup;
	subscriptions: Subscription[] = [];

	constructor(private fb: FormBuilder ) { }

	get pageName() { return this.aboutUsForm.get('pageName') }

	ngOnInit() {
		this.initializeForm();
		this.registerFormValueChange();
	}

	initializeForm() {
		if (this.aboutUs) {
			const { pageName } = this.aboutUs;
			this.aboutUsForm = this.fb.group({ pageName });
		} else {
			this.aboutUsForm = this.fb.group({ pageName: "" });
		}
	}

	registerFormValueChange() {
		const pageNameChange = this.pageName.valueChanges.pipe(
			skip(1),
			distinctUntilChanged(),
			debounceTime(DELAY_TYPE.MEDIUM)
		).subscribe(nextPageName => {
			const pageName = nextPageName;
			this.onEdit.emit({ pageName })
		});
		this.subscriptions.push(pageNameChange);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
