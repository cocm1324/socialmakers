import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BlockUiComponent } from '@components/common/block-ui/block-ui.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
		imports: [
			RouterTestingModule,
			ProgressSpinnerModule
		],
		declarations: [
			AppComponent,
			BlockUiComponent
		],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
