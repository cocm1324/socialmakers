import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-image-url',
	templateUrl: './image-url.component.html',
	styleUrls: ['./image-url.component.scss']
})
export class ImageUrlComponent implements OnInit, OnDestroy {

	@Input() label: string = "Image URL";
	@Input() initialValue: string = "";
	@Input() button: boolean = true;
	@Input() showEvent: Observable<void>;
	@Output() onSubmit: EventEmitter<string> = new EventEmitter();

	display: boolean = false;
	url: string = "";

	subscriptions: Subscription[] = [];

	constructor() { }

	ngOnInit() {
		const onShowEvent = this.showEvent.subscribe(() => {
			this.showDialog();
		});
		this.subscriptions.push(onShowEvent);
	}

	showDialog() {
		this.display = true;
		this.url = this.initialValue;
	}

	confirm() {
		this.display = false;
		this.onSubmit.emit(this.url);
	}

	cancel() {
		this.display = false;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
