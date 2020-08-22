import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ISection, TypeSectionWidth } from '@app/models';
import * as _ from 'lodash';

@Component({
	selector: 'ple-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges {

	@Input() pageData: ISection[];
	@Input() disabledByParent: boolean;
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	@Output() onSectionFinished: EventEmitter<ISection> = new EventEmitter();
	@Output() onSectionDelete: EventEmitter<ISection> = new EventEmitter();
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();

	curEditSectionData = null;
	curEdit: number = -1;
	curEditBase: number = 1;
	newSection: ISection = null;
	lock: boolean = false;

	constructor() { }

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.disabledByParent != undefined && this.disabledByParent == true) {
			this.lock = true;
		} else if (this.disabledByParent != undefined && this.disabledByParent == false) {
			this.lock = false;
		}
	}

	createNewSection() {
		let newSeq = 1;
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
		this.onEditStateChange.emit(this.curEdit != -1);
	}

	isEditing() {
		return this.curEdit != -1 || this.lock;
	}

	isNullData() {
		return this.pageData == undefined || this.pageData.length == 0;
	}

	viewerEdit(e) {
		const {seq, seqBase} = e;
		this.curEditSectionData = _.cloneDeep(this.pageData.filter(pageDatum => pageDatum.seq==seq && pageDatum.seqBase==seqBase)[0]);
		this.curEdit = seq;
		this.curEditBase = seqBase;
		this.onEditStateChange.emit(this.curEdit != -1);
	}

	closeEdit(e) {
		const changed = e ? !_.isEqual(e, this.curEditSectionData): false;

		if (changed) {
			let index = -1;
			this.pageData.map((section, i) => {
				if (this.curEdit == section.seq && this.curEditBase == section.seqBase) {
					index = i;
					return true;
				}
			});

			if (index != -1) {
				this.pageData[index] = e;
			}

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
		this.onEditStateChange.emit(this.curEdit != -1);
	}

	viewerDelete(e) {
		const {seq, seqBase} = e;
		let index = -1;
		this.pageData.map((section, i) => {
			if (seq == section.seq && seqBase == section.seqBase) {
				index = i;
				return true;
			}
		});
		this.pageData.splice(index, 1);
		this.onSectionDelete.emit(e);
	}

	finish() {
		this.onFinished.emit(true);
	}

	cancel() {
		this.onFinished.emit(false);
	}
}
