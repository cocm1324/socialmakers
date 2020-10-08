import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockUiComponent } from '@components/common/block-ui/block-ui.component';
import { LoginComponent } from '@components/common/login/login.component';
import { ReactiveFormsModule, COMPOSITION_BUFFER_MODE, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataInterceptorService } from '@services/data/data-interceptor.service';
import { DataService } from '@services/data/data.service';
import { AppAdminGuard } from './app-admin.guard';
import { PrimeModule } from './prime.module';
import { SharedModule } from './shared.module';

@NgModule({
	declarations: [
		AppComponent,
		BlockUiComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		PrimeModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule
	],
	providers: [
		AppAdminGuard,
		DataService,
		{
			provide: COMPOSITION_BUFFER_MODE,
			useValue: false
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: DataInterceptorService,
			multi: true
		}
	],
  	bootstrap: [AppComponent]
})
export class AppModule { }
