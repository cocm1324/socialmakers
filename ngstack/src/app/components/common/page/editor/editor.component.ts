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
	@Output() onSectionFinished: EventEmitter<ISection> = new EventEmitter();
	@Output() onSectionDelete: EventEmitter<ISection> = new EventEmitter();

	curEditSectionData = null;
	curEdit: number = -1;
	curEditBase: number = 1;
	newSection: ISection = null;

	constructor() { }

	ngOnInit() {
	}

	createNewSection() {
		let newSeq = 0;
		if (this.pageData && this.pageData.length > 0 && this.pageData[this.pageData.length - 1].seqBase != 0) {
			newSeq = Math.floor(this.pageData[this.pageData.length - 1].seq / this.pageData[this.pageData.length - 1].seqBase) + 1;
		}

		this.newSection = {
			type: null,
			content: "",
			width: TypeSectionWidth.NARROW,
			seq: newSeq,
			seqBase: 1,
			background: "#FFFFFF"
		};
		this.curEditSectionData = _.cloneDeep(this.newSection);
		this.curEdit = newSeq;
		this.curEditBase = 1;
	}

	isEditing() {
		return this.curEdit != -1;
	}

	isNullData() {
		return this.pageData == undefined || this.pageData.length == 0;
	}

	viewerEdit(e) {
		const {seq, seqBase} = e;
		this.curEditSectionData = _.cloneDeep(this.pageData.filter(pageDatum => pageDatum.seq==seq && pageDatum.seqBase==seqBase)[0]);
		this.curEdit = seq;
		this.curEditBase = seqBase;
	}

	closeEdit(e) {
		const changed = e ? !_.isEqual(e, this.curEditSectionData): false;

		if (changed) {
			const sectionChange = {
				seq: this.curEdit,
				seqBase: this.curEditBase,
				...e
			}
			this.onSectionFinished.emit(sectionChange);
		}

		if (this.newSection) {
			this.newSection = null;
		}

		this.curEditSectionData = null;
		this.curEdit = -1;
		this.curEditBase = 1;
	}

	viewerDelete(e) {
		this.onSectionDelete.emit(e);
	}

	finish() {
		this.onFinished.emit(true);
	}

	cancel() {
		this.onFinished.emit(false);
	}
}
