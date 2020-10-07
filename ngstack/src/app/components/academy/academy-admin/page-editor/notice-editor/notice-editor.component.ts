import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATA_LENGTH, DELAY_TYPE, NoticeBanner } from '@app/models/';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilService } from '@services/util/util.service';
import { debounceTime, distinctUntilChanged, skip, take } from 'rxjs/operators';
import { PageEditorService } from '../page-editor.service';

@Component({
	selector: 'app-notice-editor',
	templateUrl: './notice-editor.component.html',
	styleUrls: ['./notice-editor.component.scss']
})
export class NoticeEditorComponent implements OnInit, OnDestroy {

	dataLength = DATA_LENGTH;

	noticeForm: FormGroup;

	subscriptions: Subscription[] = [];

	get noticeName() {return this.noticeForm.get('noticeName');}
	get creationDateTime() {return this.noticeForm.get('creationDateTime');}
	get updateDateTime() {return this.noticeForm.get('updateDateTime');}

	constructor(
		private fb: FormBuilder,
		private utilService: UtilService,
		private pageEditorService: PageEditorService
	) { }

	ngOnInit() {
		const updateDefaultTimeString = this.utilService.dbDateTimeStringToUserReadable((new Date()).toISOString())
		const createDefaultTimeString = this.utilService.dbDateTimeStringToUserReadable((new Date('2019-12-31')).toISOString())

		this.noticeForm = this.fb.group({
			noticeName: "",
			creationDateTime: createDefaultTimeString,
			updateDateTime: updateDefaultTimeString
		});

		const initialNoticeBanner = this.pageEditorService.getBanner().pipe(
			take(1)
		).subscribe(next => {
			const {noticeName} = <NoticeBanner>next;
			if (noticeName) {
				this.noticeName.patchValue(noticeName);
			}
		});
		this.subscriptions.push(initialNoticeBanner);

		const noticeNameChange = this.noticeName.valueChanges.pipe(
			skip(1),
			distinctUntilChanged(),
			debounceTime(DELAY_TYPE.MEDIUM)
		).subscribe(nextNoticeName => {
			const nextBannerOnce = this.pageEditorService.getBanner().pipe(
				take(1)
			).subscribe(nextBanner => {
				const noticeBanner: NoticeBanner = {
					...nextBanner,
					noticeName: nextNoticeName
				};
				this.pageEditorService.nextBanner(noticeBanner);
			});
			this.subscriptions.push(nextBannerOnce);
		});
		this.subscriptions.push(noticeNameChange);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
