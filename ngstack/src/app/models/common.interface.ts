import { Binary } from '@angular/compiler';
import { TypeSectionWidth, TypeContent } from './common.enum';

export interface ISection {
    width: TypeSectionWidth;
    type: TypeContent;
    content: string;
    imageId?: number;
    imageUrl?: string;
    seq?: number;
    seqBase?: number;
    background: string;
}

export interface ISectionWithContentId extends ISection {
    contentId: number;
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
        pageName: string;
        bannerImageId: number;
        bannerImageUrl: string;
        bannerImageBlur: number;
        bannerColor?: string;
        contents: Array<ISectionWithContentId>
    };
}

export interface IUpdateAboutUsReq {
    pageName: string;
    bannerImageId: number;
    bannerImageBlur: number;
    bannerColor?: string;
}

export interface ICreateSectionReq {
    content: string;
    pageId: number;
    type: TypeContent;
    width: TypeSectionWidth;
    imageId?: number;
    background: string;
}

export interface IUpdateSectionReq {
    content: string;
    pageId: number;
    contentId: number;
    type: TypeContent;
    width: TypeSectionWidth;
    imageId?: number;
    background: string;
}

export interface IDeleteSectionReq {
    pageId: number;
    contentId: number;
}

export interface IUpdateSectionSeqReq {
    pageId: number;
    contentId: number;
}

export interface IGetCourseListRes extends ICommonRes {
    data: Array<{
        courseId: number;
        courseName: string;
        thumbImageId: number;
        thumbImageUrl: string;
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
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
    thumbImageId?: number;
    thumbImageUrl?: string;
    registerUrl: string;
}

export interface ICreateCourseReq extends ICourseInfo {
    
}

export interface ICreateCourseRes extends ICommonRes {
    data: {
        courseId: number;
    }
}

export interface ICourseInfoWithContents extends ICourseInfo {
    courseId: number;
    thumbImageId: number;
    thumbImageUrl: string;
    bannerImageId: number;
    bannerImageUrl: string;
    contents: Array<ISectionWithContentId>;
}

export interface IUpdateCourseInfoReq extends ICourseInfo {
    courseId: number;
}

export interface IUpdateCourseSeqReq {
    courseId: number;
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

export interface IGetImageListRes extends ICommonRes {
    data: {
        pageCount: number;
        pageNo: number;
        rowCount: number;
        images: Array<IImage>;
    }
}

export interface IImage {
    fileName: string;
    imageId: number;
    thumbUrl?: string;
    url: string;
}

export interface INotice {
    noticeId?: number;
    noticeName: string;
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
    creationDateTime: string;
    updateDateTime: string;
    featured: number;
    published: number;
}

export interface IGetNoticeListRes extends ICommonRes {
    data: {
        notices: INotice[];
        pageCount: number;
        pageNo: number;
        rowCount: number;
    }
}

export interface IGetNoticeRes extends ICommonRes {
    data: {
        noticeId: number;
        noticeName: string;
        bannerImageId?: number;
        bannerImageUrl?: string;
        bannerImageBlur?: number;
        bannerColor?: string;
        contents: ISectionWithContentId[];
        creationDateTime: string;
        updateDateTime: string;
        featured: number;
        published: number;
    }
}

export interface IUpdateNoticeReq {
    noticeId: number;
    noticeName: string;
    bannerImageId?: number;
    bannerImageBlur?: number;
    bannerColor?: string;
}