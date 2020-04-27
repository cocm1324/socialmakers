import {NgModule} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import {CardModule} from 'primeng/card';

@NgModule({
    imports: [
        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
    ],
    exports: [
        ButtonModule,
        ProgressSpinnerModule,
        CarouselModule,
        CardModule,
    ]
})
export class AppCommonModule {}