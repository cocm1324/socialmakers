import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUrlComponent } from './image-url.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

describe('ImageUrlComponent', () => {
	let component: ImageUrlComponent;
	let fixture: ComponentFixture<ImageUrlComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				ImageUrlComponent
			],
			imports: [
				DialogModule,
				ButtonModule,
				FormsModule,
				InputTextModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImageUrlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
