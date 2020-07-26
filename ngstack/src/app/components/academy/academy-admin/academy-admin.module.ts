import {NgModule} from '@angular/core';
import {AcademyAdminComponent} from './academy-admin.component';
import {AppCommonModule} from '@app/app-common.module';
import { AcademyAdminRoutingModule } from './academy-admin-routing.module';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { PageModule } from '@components/common/page/page.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AboutUsEditorComponent } from './page-editor/about-us-editor/about-us-editor.component';
import { CourseEditorComponent } from './page-editor/course-editor/course-editor.component';
import { NoticeEditorComponent } from './page-editor/notice-editor/notice-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from '@components/common/image/image.module';

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
        AppCommonModule,
        PageModule,
        ReactiveFormsModule,
        ImageModule
    ]
})
export class AcademyAdminModule { }