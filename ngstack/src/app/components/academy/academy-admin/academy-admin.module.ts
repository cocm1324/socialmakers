import {NgModule} from '@angular/core';

import { AcademyAdminComponent } from './academy-admin.component';
import { AcademyAdminRoutingModule } from './academy-admin-routing.module';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { PageModule } from '@components/common/page/page.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AboutUsEditorComponent } from './page-editor/about-us-editor/about-us-editor.component';
import { CourseEditorComponent } from './page-editor/course-editor/course-editor.component';
import { NoticeEditorComponent } from './page-editor/notice-editor/notice-editor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageModule } from '@components/common/image/image.module';
import { PrimeModule } from '@app/prime.module';
import { SharedModule } from '@app/shared.module';

@NgModule({
    declarations: [
        AcademyAdminComponent,
        PageEditorComponent,
        AdminMainComponent,
        AboutUsEditorComponent,
        CourseEditorComponent,
        NoticeEditorComponent
    ],
    imports: [
        AcademyAdminRoutingModule,
        PrimeModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ImageModule,
        PageModule
    ]
})
export class AcademyAdminModule { }