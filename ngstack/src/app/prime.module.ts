import {NgModule} from '@angular/core';

import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import {AccordionModule} from 'primeng/accordion';
import {ColorPickerModule} from 'primeng/colorpicker';
import {OrderListModule} from 'primeng/orderlist';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SliderModule} from 'primeng/slider';
import {TooltipModule} from 'primeng/tooltip';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
    imports: [
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
        PaginatorModule,
        SelectButtonModule,
        SliderModule,
        TooltipModule,
        OverlayPanelModule
    ],
    exports: [
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
        PaginatorModule,
        SelectButtonModule,
        SliderModule,
        TooltipModule,
        OverlayPanelModule
    ]
})
export class PrimeModule {}