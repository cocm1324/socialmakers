import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AcademyAdminComponent} from './academy-admin.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AcademyAdminComponent, children: [
                { path: '', component: AdminMainComponent },
                { path: 'pageEditor/aboutUs', component: PageEditorComponent },
                { path: 'pageEditor/course/new', component: PageEditorComponent },
                { path: 'pageEditor/course/:id', component: PageEditorComponent }
            ]}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AcademyAdminRoutingModule {}
