import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common'; 
import { AppCommonModule } from '@app/app-common.module';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageUrlComponent } from './image-url/image-url.component';

@NgModule({
    declarations: [
        ImageUploadComponent,
        ImageUrlComponent
    ],
    imports: [
        CommonModule,
        AppCommonModule
    ],
    exports: [
        ImageUploadComponent,
        ImageUrlComponent
    ]
})
export class ImageModule { }