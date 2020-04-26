import {Component, OnInit, Input} from '@angular/core';
import {ISection, TypeSectionWidth, TypeContent} from '../common';

@Component({
	selector: 'app-section-viewer',
	templateUrl: './section-viewer.component.html',
	styleUrls: ['./section-viewer.component.scss']
})
export class SectionViewerComponent implements OnInit {

	@Input() section: ISection;
	typeWidth = TypeSectionWidth;
	typeContent = TypeContent;
	
	get width() {return this.section.width}
	get type() {return this.section.type}
	get content() {return this.section.content}

	constructor() { }

	ngOnInit() {
	}

	isImage() {return this.type == this.typeContent.IMAGE}
	isPost() {return this.type == this.typeContent.POST}
	
	isWide() {return this.width == this.typeWidth.WIDE}
	isMedium() {return this.width == this.typeWidth.MEDIUM}
	isNarrow() {return this.width == this.typeWidth.NARROW}
}
