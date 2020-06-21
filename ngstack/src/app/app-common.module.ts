import {NgModule} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        FormsModule,
        HttpClientModule,

        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
        DialogModule,
        InputTextModule,
        FileUploadModule,
        FieldsetModule,

    ],
    exports: [
        FormsModule,
        HttpClientModule,
        
        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
        DialogModule,
        InputTextModule,
        FileUploadModule,
        FieldsetModule
    ]
})
export class AppCommonModule {}