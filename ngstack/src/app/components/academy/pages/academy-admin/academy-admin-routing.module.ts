import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AcademyAdminComponent} from './academy-admin.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: AcademyAdminComponent}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AcademyAdminRoutingModule {}
