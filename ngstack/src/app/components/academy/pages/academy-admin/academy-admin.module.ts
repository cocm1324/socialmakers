import {NgModule} from '@angular/core';
import {AcademyAdminComponent} from './academy-admin.component';
import {AppCommonModule} from '@app/app-common.module';
import { AcademyAdminRoutingModule } from './academy-admin-routing.module';

@NgModule({
    declarations: [
        AcademyAdminComponent,
    ],
    imports: [
        AcademyAdminRoutingModule,
        AppCommonModule,
    ]
})
export class AcademyAdminModule { }