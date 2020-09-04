import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ISection, TypeSectionWidth, ISectionWithContentId } from '@app/models';
import * as _ from 'lodash';

const enum SectionState {
	NOT_EDITING = -1,
	NEW = 0
};

@Component({
	selector: 'ple-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges {

	@Input() pageData: ISectionWithContentId[];
	@Input() disabledByParent: boolean;
	@Output() onFinished: EventEmitter<any> = new EventEmitter();
	@Output() onSectionFinished: EventEmitter<ISection> = new EventEmitter();
	@Output() onSectionDelete: EventEmitter<ISection> = new EventEmitter();
	@Output() onEditStateChange: EventEmitter<boolean> = new EventEmitter();

	curEditSectionData = {contentId: SectionState.NOT_EDITING};
	newSection: ISectionWithContentId = null;
	lock: boolean = false;

	constructor() { }

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {
		if (this.disabledByParent != undefined && this.disabledByParent == true) {
			this.lock = true;
		} else if (this.disabledByParent != undefined && this.disabledByParent == false) {
			this.lock = false;
		}
	}

	createNewSection() {
		this.newSection = {
			contentId: SectionState.NEW,
			type: null,
			content: "",
			width: TypeSectionWidth.NARROW,
			background: "#FFFFFF"
		};
		this.curEditSectionData = _.cloneDeep(this.newSection);
		this.onEditStateChange.emit(this.curEditSectionData.contentId != SectionState.NOT_EDITING);
	}

	cancelNewSection() {
		if (this.newSection) {
			this.newSection = null;
		}

		this.curEditSectionData = {contentId: -1};
		this.onEditStateChange.emit(this.curEditSectionData.contentId != SectionState.NOT_EDITING);
	}

	isEditing() {
		return this.curEditSectionData.contentId != SectionState.NOT_EDITING || this.lock;
	}

	isNullData() {
		return this.pageData == undefined || this.pageData.length == 0;
	}

	viewerEdit(e) {
		const {contentId} = e;
		this.curEditSectionData = _.cloneDeep(this.pageData.filter(pageDatum => pageDatum.contentId == contentId)[0]);
		this.onEditStateChange.emit(this.curEditSectionData.contentId != SectionState.NOT_EDITING);
	}

	closeEdit(e) {
		const changed = e ? !_.isEqual(e, this.curEditSectionData): false;

		if (changed) {
			let index = -1;
			this.pageData.map((section, i) => {
				if (this.curEditSectionData.contentId == section.contentId) {
					index = i;
					return true;
				}
			});

			if (index != -1) {
				this.pageData[index] = e;
			}

			const sectionChange = {
				contentId: this.curEditSectionData.contentId,
				...e
			}
			this.onSectionFinished.emit(sectionChange);
		}

		if (this.newSection) {
			this.newSection = null;
		}

		this.curEditSectionData = {contentId: -1};
		this.onEditStateChange.emit(this.curEditSectionData.contentId != SectionState.NOT_EDITING);
	}

	viewerDelete(e) {
		const {contentId} = e;
		let index = -1;
		for (let i = 0; i < this.pageData.length; i++) {
			if (this.pageData[i].contentId == contentId) {
				index = i;
				break;
			}
		}
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
