import {TypeSectionWidth, TypeContent} from './enum';

export interface ISection {
    width: TypeSectionWidth;
    type: TypeContent;
    content: string;
}