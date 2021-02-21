import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common'; 
import { EditorModule } from 'primeng/editor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageModule } from '../image/image.module';
import { PrimeModule } from '@app/prime.module';
import { BannerEditorComponent } from './banner-editor/banner-editor.component';
import { BannerViewerComponent } from './banner-viewer/banner-viewer.component'

@NgModule({
    declarations: [
        BannerEditorComponent,
        BannerViewerComponent
    ],
    imports: [
        CommonModule,
        EditorModule,
        ReactiveFormsModule,
        FormsModule,
        ImageModule,
        PrimeModule
    ],
    exports: [
        BannerEditorComponent,
        BannerViewerComponent
    ]
})
export class BannerModule { }