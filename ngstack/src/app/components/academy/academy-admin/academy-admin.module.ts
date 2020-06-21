import {NgModule} from '@angular/core';
import {AcademyAdminComponent} from './academy-admin.component';
import {AppCommonModule} from '@app/app-common.module';
import { AcademyAdminRoutingModule } from './academy-admin-routing.module';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { PageModule } from '@components/common/page/page.module';
import { AdminMainComponent } from './admin-main/admin-main.component';

@NgModule({
    declarations: [
        AcademyAdminComponent,
        PageEditorComponent,
        AdminMainComponent
    ],
    imports: [
        AcademyAdminRoutingModule,
        AppCommonModule,
        PageModule
    ]
})
export class AcademyAdminModule { }