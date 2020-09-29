import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDatetimePipe } from './pipes/user-datetime.pipe';
import { ContextMenuComponent } from '@components/common/context-menu/context-menu.component';
import { PrimeModule } from './prime.module';


@NgModule({
    declarations: [
        UserDatetimePipe,
        ContextMenuComponent
    ],
    imports: [
        CommonModule,
        PrimeModule
    ],
    exports: [
        UserDatetimePipe,
        ContextMenuComponent
    ]
})
export class SharedModule {}