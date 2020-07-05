import {NgModule} from '@angular/core';
import {PageComponent} from './page.component';
import {EditorComponent} from './editor/editor.component';
import {ViewerComponent} from './viewer/viewer.component';
import { SectionEditorComponent } from './section-editor/section-editor.component';
import { SectionViewerComponent } from './section-viewer/section-viewer.component';

import {CommonModule} from '@angular/common'; 
import {EditorModule} from 'primeng/editor';
import {ReactiveFormsModule} from '@angular/forms';
import {ImageModule} from '../image/image.module';
import { AppCommonModule } from '@app/app-common.module';

@NgModule({
    declarations: [
        PageComponent,
        EditorComponent,
        ViewerComponent,
        SectionEditorComponent,
        SectionViewerComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        EditorModule,
        ReactiveFormsModule,
        ImageModule,
    ],
    exports: [
        EditorComponent,
        ViewerComponent
    ]
})
export class PageModule { }