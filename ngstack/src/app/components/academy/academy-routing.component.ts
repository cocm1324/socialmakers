import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { AcademyComponent } from './academy.component';
import { MainComponent } from './pages/main/main.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CourseComponent } from './pages/course/course.component';
import { ReviewComponent } from './pages/review/review.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { AnnounceComponent } from './pages/announce/announce.component';
import { AppAdminGuard } from '@app/app-admin.guard';
import { ACADEMY_URL } from '@app/models/';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: ACADEMY_URL.ROOT, component: AcademyComponent, children: [
                {path: ACADEMY_URL.MAIN, component: MainComponent},
                {path: ACADEMY_URL.ABOUT_US, component: AboutUsComponent},
                {path: ACADEMY_URL.COURSES, component: CourseComponent},
                {path: ACADEMY_URL.REVIEW, component: ReviewComponent},
                {path: ACADEMY_URL.NOTICE_MAIN, component: NoticeComponent},
                {path: ACADEMY_URL.NOTICE, component: AnnounceComponent},
            ]},
            {path: ACADEMY_URL.ADMIN, loadChildren: () => import(`./academy-admin/academy-admin.module`).then(module => module.AcademyAdminModule), canActivate: [AppAdminGuard] }
        ])
    ],
    exports: [RouterModule]
})
export class AcademyRoutingModule {}
