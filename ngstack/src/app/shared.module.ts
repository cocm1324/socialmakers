import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDatetimePipe } from './pipes/user-datetime.pipe';


@NgModule({
    declarations: [
        UserDatetimePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        UserDatetimePipe
    ]
})
export class SharedModule {}