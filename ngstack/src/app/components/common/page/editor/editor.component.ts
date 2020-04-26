import { Component, OnInit } from '@angular/core';
import { ISection, TypeContent, TypeSectionWidth } from '../common';

const mockup = [
	{
		width: 2,
		type: 0,
		content: "https://cdn.vox-cdn.com/thumbor/fX2H2kXoVxztcgbEsZruISsjO9s=/0x0:2040x1360/1720x0/filters:focal(0x0:2040x1360):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/15987610/vpavic_190322_3297_0030.jpg"
	},
	{
		width: 0,
		type: 1,
		content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
		width: 1,
		type: 0,
		content: "https://miro.medium.com/max/1400/1*t6Dd-hq4lTm1-ooyBP6vDw.jpeg"
	},
	{
		width: 0,
		type: 1,
		content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	},
]

@Component({
	selector: 'ple-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

	pageData: ISection[];
	curEdit: number = -1;
	isNew: boolean = false;

	constructor() { }

	ngOnInit() {
		this.pageData = mockup;
	}

	closeEdit(event) {
		if (event) {
			this.pageData[this.curEdit] = event;
			this.curEdit = -1;
			this.isNew = false;
		} else {
			if (this.isNew) {
				this.pageData.pop();
				this.isNew = false;
			}
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
}
