import {NgModule} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
    imports: [
        ButtonModule,
        ProgressSpinnerModule,
    ],
    exports: [
        ButtonModule,
        ProgressSpinnerModule,
    ]
})
export class AppCommonModule {}