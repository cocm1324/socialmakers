import {NgModule} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import {AccordionModule} from 'primeng/accordion';
import {ColorPickerModule} from 'primeng/colorpicker';
import {OrderListModule} from 'primeng/orderlist';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
    imports: [
        FormsModule,

        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
        DialogModule,
        InputTextModule,
        FileUploadModule,
        FieldsetModule,
        PanelModule,
        AccordionModule,
        ColorPickerModule,
        OrderListModule,
        InputTextareaModule,
        TableModule,
        PaginatorModule
    ],
    exports: [
        FormsModule,
        
        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
        DialogModule,
        InputTextModule,
        FileUploadModule,
        FieldsetModule,
        PanelModule,
        AccordionModule,
        ColorPickerModule,
        OrderListModule,
        InputTextareaModule,
        TableModule,
        PaginatorModule
    ]
})
export class AppCommonModule {}