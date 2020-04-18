import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { AcademyComponent } from './academy.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: AcademyComponent}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AcademyRoutingModule {}
