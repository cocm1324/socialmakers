import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { ISection, TypeContent, TypeSectionWidth } from '../common';

@Component({
	selector: 'ple-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

	@Input() pageData: ISection[];
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	curEdit: number = -1;
	isNew: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	closeEdit($event) {
		if ($event) {
			this.pageData[this.curEdit] = $event;
			this.curEdit = -1;
			this.isNew = false;
		} else {
			if (this.isNew) {
				this.pageData.pop();
				this.isNew = false;
			}
			this.curEdit = -1;
		}
	}

	newSection() {
		const section: ISection = {
			type: null,
			content: "",
			width: TypeSectionWidth.NARROW
		};
		this.pageData.push(section);
		this.curEdit = this.pageData.length - 1;
		this.isNew = true;
	}

	isEditing() {
		return this.curEdit != -1;
	}

	isNullData() {
		return this.pageData == undefined || this.pageData.length == 0;
	}

	viewerEdit($event) {
		this.curEdit = $event;
	}

	viewerDelete($event) {
		this.pageData.splice($event, 1);
	}

	save() {
		this.onFinished.emit(this.pageData);
	}

	cancel() {
		this.onFinished.emit(false);
	}
}
