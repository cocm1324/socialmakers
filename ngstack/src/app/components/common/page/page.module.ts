import {NgModule} from '@angular/core';
import {PageComponent} from './page.component';
import {EditorComponent} from './editor/editor.component';
import {ViewerComponent} from './viewer/viewer.component';
import { SectionEditorComponent } from './section-editor/section-editor.component';
import { SectionViewerComponent } from './section-viewer/section-viewer.component';

import { CommonModule } from '@angular/common'; 
import {EditorModule} from 'primeng/editor';
import {ReactiveFormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    declarations: [
        PageComponent,
        EditorComponent,
        ViewerComponent,
        SectionEditorComponent,
        SectionViewerComponent
    ],
    imports: [
        CommonModule,
        EditorModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule
    ],
    exports: [
        EditorComponent,
        ViewerComponent
    ]
})
export class PageModule { }