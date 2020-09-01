import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ISection, TypeSectionWidth, TypeContent, ISectionWithContentId} from '@app/models';

@Component({
	selector: 'app-section-viewer',
	templateUrl: './section-viewer.component.html',
	styleUrls: ['./section-viewer.component.scss']
})
export class SectionViewerComponent implements OnInit {

	@Input() section: ISectionWithContentId;
	@Input() editable: boolean = false;
	@Output() onEdit: EventEmitter<any> = new EventEmitter();
	@Output() onDelete: EventEmitter<any> = new EventEmitter();
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	
	get width() {return this.section.width}
	get type() {return this.section.type}
	get content() {
		if (this.isImage()) {
			return this.section.imageUrl;
		} else {
			return this.section.content;
		}
	}
	get background() {return this.section.background}

	constructor() {}

	ngOnInit() {}

	isImage() {return this.type == this.typeContent.IMAGE || this.type == this.typeContent.IMAGE_URL}
	isPost() {return this.type == this.typeContent.POST}
	
	isWide() {return this.width == this.typeWidth.WIDE}
	isMedium() {return this.width == this.typeWidth.MEDIUM}
	isNarrow() {return this.width == this.typeWidth.NARROW}

	edit() {
		this.onEdit.emit({
			contentId: this.section.contentId
		});
	}

	delete() {
		if (confirm("섹션을 삭제하시겠습니까?")) {
			this.onDelete.emit({
				contentId: this.section.contentId
			});
		}
	}
}
