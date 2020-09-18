import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageUrlComponent } from './image-url/image-url.component';
import { PrimeModule } from '@app/prime.module';

@NgModule({
    declarations: [
        ImageUploadComponent,
        ImageUrlComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PrimeModule
    ],
    exports: [
        ImageUploadComponent,
        ImageUrlComponent
    ]
})
export class ImageModule { }