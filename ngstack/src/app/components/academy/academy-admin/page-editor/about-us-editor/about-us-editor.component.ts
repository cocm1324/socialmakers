import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DATA_LENGTH, AboutUsBanner, DELAY_TYPE } from '@app/models';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, take } from 'rxjs/operators';
import { PageEditorService } from '../page-editor.service';

@Component({
	selector: 'app-about-us-editor',
	templateUrl: './about-us-editor.component.html',
	styleUrls: ['./about-us-editor.component.scss']
})
export class AboutUsEditorComponent implements OnInit, OnDestroy {

	dataLength = DATA_LENGTH;

	aboutUsForm: FormGroup;
	subscriptions: Subscription[] = [];

	constructor(
		private fb: FormBuilder,
		private pageEditorService: PageEditorService	
	) { }

	get pageName() {return this.aboutUsForm.get('pageName');}

	ngOnInit() {
		this.initializeForm();
		this.getBannerAndPatchForm();
		this.registerFormValueChange();
	}

	initializeForm() {
		this.aboutUsForm = this.fb.group({
			pageName: ""
		});
	}

	getBannerAndPatchForm() {
		const getOnce = this.pageEditorService.getBanner().pipe(
			take(1)
		).subscribe(next => {
			const {pageName} = <AboutUsBanner>next;
			if (pageName) {
				this.pageName.patchValue(pageName);
			}
		});
		this.subscriptions.push(getOnce);
	}

	registerFormValueChange() {
		const pageNameChange = this.pageName.valueChanges.pipe(
			skip(1),
			distinctUntilChanged(),
			debounceTime(DELAY_TYPE.MEDIUM)
		).subscribe(nextPageName => {
			this.pageEditorService.getBanner().toPromise().then(nextBanner => {
				const aboutUsBanner: AboutUsBanner = {
					...nextBanner,
					pageName: nextPageName
				};
				this.pageEditorService.nextBanner(aboutUsBanner);
			});
		});
		this.subscriptions.push(pageNameChange);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
