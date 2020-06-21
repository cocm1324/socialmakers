import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './app-common.module';
import { BlockUiComponent } from '@components/common/block-ui/block-ui.component';
import { LoginComponent } from '@components/common/login/login.component';
import { ReactiveFormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataInterceptorService } from '@services/data/data-interceptor.service';
import { DataService } from '@services/data/data.service';
import { AppAdminGuard } from './app-admin.guard';

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
		AppCommonModule,
		ReactiveFormsModule,
		HttpClientModule
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
		},
	],
  	bootstrap: [AppComponent]
})
export class AppModule { }
