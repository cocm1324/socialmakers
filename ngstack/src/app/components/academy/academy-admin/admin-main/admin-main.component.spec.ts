import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMainComponent } from './admin-main.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '@services/data/data.service';
import { UtilService } from '@services/util/util.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataInterceptorService } from '@services/data/data-interceptor.service';

describe('AdminMainComponent', () => {
	let component: AdminMainComponent;
	let fixture: ComponentFixture<AdminMainComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ 
				AdminMainComponent
			],
			imports: [
				PanelModule,
				ButtonModule,
				OrderListModule,
				TableModule,
				RouterTestingModule,
				HttpClientModule,
				BrowserAnimationsModule
			],
			providers: [
				DataService,
				UtilService,
				DataInterceptorService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminMainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
