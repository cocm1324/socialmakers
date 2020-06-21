import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './app-common.module';
import { BlockUiComponent } from '@components/common/block-ui/block-ui.component';
import { LoginComponent } from '@components/common/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

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
		ReactiveFormsModule
	],
	providers: [],
  	bootstrap: [AppComponent]
})
export class AppModule { }
