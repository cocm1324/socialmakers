import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ISection, TypeSectionWidth, TypeContent} from '@app/models';

@Component({
	selector: 'app-section-viewer',
	templateUrl: './section-viewer.component.html',
	styleUrls: ['./section-viewer.component.scss']
})
export class SectionViewerComponent implements OnInit {

	@Input() section: ISection;
	@Input() editable: boolean = false;
	@Input() index: number;
	@Output() onEdit: EventEmitter<number> = new EventEmitter();
	@Output() onDelete: EventEmitter<number> = new EventEmitter();
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	
	get width() {return this.section.width}
	get type() {return this.section.type}
	get content() {return this.section.content}

	constructor() {}

	ngOnInit() {}

	isImage() {return this.type == this.typeContent.IMAGE || this.type == this.typeContent.IMAGE_URL}
	isPost() {return this.type == this.typeContent.POST}
	
	isWide() {return this.width == this.typeWidth.WIDE}
	isMedium() {return this.width == this.typeWidth.MEDIUM}
	isNarrow() {return this.width == this.typeWidth.NARROW}

	edit() {
		if (this.index >= 0) {
			this.onEdit.emit(this.index);
		} 
	}

	delete() {
		if (confirm("섹션을 삭제하시겠습니까?")) {
			this.onDelete.emit(this.index);
		}
	}
}
