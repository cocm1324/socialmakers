import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './app-common.module';
import { BlockUiComponent } from '@components/common/block-ui/block-ui.component';

@NgModule({
	declarations: [
		AppComponent,
		BlockUiComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		AppCommonModule,
	],
	providers: [],
  	bootstrap: [AppComponent]
})
export class AppModule { }
