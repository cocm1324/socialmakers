import {NgModule} from '@angular/core';
import { AcademyComponent } from './academy.component';
import { AcademyRoutingModule } from './academy-routing.component';
import { PageModule } from '@components/common/page/page.module';
import { MainComponent } from './pages/main/main.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CourseComponent } from './pages/course/course.component';
import { ReviewComponent } from './pages/review/review.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { AnnounceComponent } from './pages/announce/announce.component';
import { AppCommonModule } from '@app/app-common.module';

@NgModule({
    declarations: [
        AcademyComponent,
        MainComponent,
        AboutUsComponent,
        CourseComponent,
        ReviewComponent,
        NoticeComponent,
        AnnounceComponent
    ],
    imports: [
        AcademyRoutingModule,
        AppCommonModule,
        PageModule
    ]
})
export class AcademyModule { }