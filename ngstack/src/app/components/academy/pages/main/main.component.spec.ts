import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainComponent', () => {
	let component: MainComponent;
	let fixture: ComponentFixture<MainComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				MainComponent 
			],
			imports: [
				CardModule, 
				CarouselModule,
				RouterTestingModule
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
