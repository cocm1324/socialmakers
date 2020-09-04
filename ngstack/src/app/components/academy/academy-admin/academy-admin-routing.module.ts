import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AcademyAdminComponent } from './academy-admin.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { ACADEMY_ADMIN_URL } from '@app/models/';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ACADEMY_ADMIN_URL.ROOT, component: AcademyAdminComponent, children: [
                { path: ACADEMY_ADMIN_URL.ADMIN_MAIN, component: AdminMainComponent },
                { path: ACADEMY_ADMIN_URL.ABOUT_US, component: PageEditorComponent },
                { path: ACADEMY_ADMIN_URL.NEW_COURSE, component: PageEditorComponent },
                { path: ACADEMY_ADMIN_URL.COURSE, component: PageEditorComponent },
                { path: ACADEMY_ADMIN_URL.NEW_NOTICE, component: PageEditorComponent },
                { path: ACADEMY_ADMIN_URL.NOTICE, component: PageEditorComponent }
            ]}
        ])
    ],
    exports: [RouterModule]
})
export class AcademyAdminRoutingModule {}
