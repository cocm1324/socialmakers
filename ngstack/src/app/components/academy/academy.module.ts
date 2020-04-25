import {NgModule} from '@angular/core';
import { AcademyComponent } from './academy.component';
import { AcademyRoutingModule } from './academy-routing.component';
import { PageModule } from '@components/common/page/page.module';

@NgModule({
    declarations: [
        AcademyComponent
    ],
    imports: [
        AcademyRoutingModule,
        PageModule
    ]
})
export class AcademyModule { }