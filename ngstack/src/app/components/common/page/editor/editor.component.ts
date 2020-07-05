import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { ISection, TypeContent, TypeSectionWidth } from '@app/models';
import * as _ from 'lodash';

@Component({
	selector: 'ple-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

	@Input() pageData: ISection[];
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	@Output() onSectionFinished: EventEmitter<any> = new EventEmitter();
	@Output() onSectionDelete: EventEmitter<any> = new EventEmitter();

	curEditSectionData = null;
	curEdit: number = -1;
	newSection: ISection = null;

	constructor() { }

	ngOnInit() {
	}

	createNewSection() {
		this.newSection = {
			type: null,
			content: "",
			width: TypeSectionWidth.NARROW,
			seq: this.pageData && this.pageData.length > 0 ? this.pageData[this.pageData.length - 1].seq + 1 : 0
		};
		this.curEditSectionData = _.cloneDeep(this.newSection);
		this.curEdit = this.pageData && this.pageData.length > 0 ? this.pageData[this.pageData.length - 1].seq + 1 : 0;
	}

	isEditing() {
		return this.curEdit != -1;
	}

	isNullData() {
		return this.pageData == undefined || this.pageData.length == 0;
	}

	viewerEdit($event) {
		this.curEditSectionData = _.cloneDeep(this.pageData[$event]);
		this.curEdit = $event;
	}

	closeEdit(e) {
		const changed = e ? !_.isEqual(e, this.curEditSectionData): false;

		if (changed) {
			const sectionChange = {
				seq: this.curEdit,
				...e
			}
			this.onSectionFinished.emit(sectionChange);
		}

		if (this.newSection) {
			this.newSection = null;
		}

		this.curEditSectionData = null;
		this.curEdit = -1;
	}

	viewerDelete(e) {
		this.onSectionDelete.emit(this.pageData[e].seq);
	}

	finish() {
		this.onFinished.emit(true);
	}

	cancel() {
		this.onFinished.emit(false);
	}
}
