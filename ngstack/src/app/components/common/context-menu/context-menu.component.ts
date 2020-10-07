import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
	selector: 'app-context-menu',
	templateUrl: './context-menu.component.html',
	styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, AfterViewInit {

	@Input() target: any;
	@Input() content: TemplateRef<any>;
	@ViewChild('overlay', {static: false}) overlay: OverlayPanel;

	display: boolean;
	mouseX: number;
	mouseY: number;

	private element: any;

	get style() {
		return `{'top': ${this.mouseY}px;}`;
	}

	constructor() { }

	ngOnInit() {
	
	}

	ngAfterViewInit() {
		if (this.target) {
			this.element = this.target;
		}

		this.element.addEventListener('contextmenu', this.onLeftClickElement.bind(this));
	}

	onLeftClickElement(e) {
		e.preventDefault();
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;
		this.display = true;
	}
}
