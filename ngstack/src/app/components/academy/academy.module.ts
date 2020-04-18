import {NgModule} from '@angular/core';
import { AcademyComponent } from './academy.component';
import { AcademyRoutingModule } from './academy-routing.component';

@NgModule({
    declarations: [
        AcademyComponent
    ],
    imports: [
        AcademyRoutingModule
    ]
})
export class AcademyModule { }