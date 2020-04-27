import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { AcademyComponent } from './academy.component';
import { MainComponent } from './pages/main/main.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CourseComponent } from './pages/course/course.component';
import { ReviewComponent } from './pages/review/review.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { AnnounceComponent } from './pages/announce/announce.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: AcademyComponent, children: [
                {path: '', component: MainComponent},
                {path: 'aboutUs', component: AboutUsComponent},
                {path: 'courses/:id', component: CourseComponent},
                {path: 'review', component: ReviewComponent},
                {path: 'notice', component: NoticeComponent},
                {path: 'notice/:id', component: AnnounceComponent},
            ]}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AcademyRoutingModule {}
