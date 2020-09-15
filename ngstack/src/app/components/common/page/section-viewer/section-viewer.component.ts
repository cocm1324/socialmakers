import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TypeSectionWidth, TypeContent, ISectionWithContentId} from '@app/models';

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
	
	sectionData: ISectionWithContentId;

	get width() {return this.sectionData.width;}
	get type() {return this.sectionData.type;}
	get content() {return this.sectionData.content;}
	get imageUrl() {return this.sectionData.imageUrl;}
	get background() {return this.sectionData.background;}

	constructor() {}
	ngOnInit() {
		if (this.section) {
			this.sectionData = {
				...this.section
			};
		} else {
			this.sectionData = {
				contentId: -1,
				width: this.typeWidth.NARROW,
				type: this.typeContent.IMAGE,
				content: "",
				background: "#ffffff"
			}
		}
	}

	isImage() {return this.type == this.typeContent.IMAGE;}
	isImageUrl() {return this.type == this.typeContent.IMAGE_URL;}
	isPost() {return this.type == this.typeContent.POST;}
	
	isWide() {return this.width == this.typeWidth.WIDE;}
	isMedium() {return this.width == this.typeWidth.MEDIUM;}
	isNarrow() {return this.width == this.typeWidth.NARROW;}

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
