import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AcademyAdminComponent} from './academy-admin.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: AcademyAdminComponent, children: [
                {path: '', component: AdminMainComponent},
                {path: 'pageEditor/:pageType', component: PageEditorComponent},
                {path: 'pageEditor/:pageType/:id', component: PageEditorComponent}
            ]}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AcademyAdminRoutingModule {}
