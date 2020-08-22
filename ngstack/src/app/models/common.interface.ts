import { Binary } from '@angular/compiler';
import { TypeSectionWidth, TypeContent } from './common.enum';

export interface ISection {
    width: TypeSectionWidth;
    type: TypeContent;
    content: string;
    imageId?: number;
    seq: number;
    seqBase: number;
    background: string;
}

export interface ICommonRes {
    status: boolean;
    error?: {
        code?: number;
        message?: string;
    }
}

export interface IRunLoginReq {
    login: string;
    password: string;
}

export interface IRunLoginRes extends ICommonRes {
    data: {
        token: string;
        login: string;
    };
}

export interface IRunVerifyLoginRes extends ICommonRes {
    data: {
        token: string;
        login: string;
    };
}

export interface ICreateImageReq {
    upload: Binary;
}

export interface IGetAboutUsRes extends ICommonRes {
    data: {
        pageId: number;
        name: string;
        imageId: number;
        imageUrl: string;
        contents: Array<ISection>
    };
}

export interface IUpdateAboutUsReq {
    name: string;
    imageId: number;
}

export interface IUpdateSectionReq {
    content: string;
    pageId: number;
    seq: number;
    seqBase: number;
    type: TypeContent;
    width: TypeSectionWidth;
    imageId?: number;
    background: string;
}

export interface ICreateSectionReq {
    content: string;
    pageId: number;
    seq: number;
    seqBase: number;
    type: TypeContent;
    width: TypeSectionWidth;
    imageId?: number;
    background: string;
}

export interface IDeleteSectionReq {
    pageId: number;
    seq: number;
    seqBase: number;
}

export interface IGetCourseListRes extends ICommonRes {
    data: Array<{
        courseId: number;
        courseName: string;
        courseThumb: string;
        courseThumbThumb: string;
        courseThumbImageId: number;
        seq: number;
        seqBase: number;
    }>;
}

export interface IGetCourseRes extends ICommonRes {
    data: ICourseInfoWithContents;
}

export interface ICourseInfo {
    courseName: string;
    description1: string;
    description2: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    fieldTitle1: string;
    fieldTitle2: string;
    fieldTitle3: string;
    fieldTitle4: string;
    fieldTitle5: string;
    fieldTitle6: string;
    pageImageId: number;
    thumbImageId: number;
    pageImageUrl?: string;
    thumbImageUrl?: string;
    registerUrl: string;
}

export interface ICreateCourseReq extends ICourseInfo {
    seq: number;
    seqBase: number;
}

export interface ICreateCourseRes extends ICommonRes {
    data: {
        courseId: number;
    }
}

export interface ICourseInfoWithContents extends ICourseInfo {
    courseId: number;
    pageImageUrl: string;
    thumbImageUrl: string;
    contents: Array<ISection>;
}

export interface IUpdateCourseInfoReq extends ICourseInfo {
    courseId: number;
}

export interface IUpdateCourseSeqReq {
    courseId: number;
    seq: number;
    seqBase: number;
}

export interface IRunEyedropReq {
    x: number;
    y: number;
    width: number;
    height: number;
    imageId: number;
}

export interface IRunEyedropRes extends ICommonRes {
    data: string;
}

export interface IAboutUsEditorInput {
    name: string;
    background: string;
    imageId: number;
}