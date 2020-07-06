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
        OrderListModule
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
        OrderListModule
    ]
})
export class AppCommonModule {}