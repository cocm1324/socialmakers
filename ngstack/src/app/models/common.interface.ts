import { Binary } from '@angular/compiler';
import { PAGE_TYPE, TypeSectionWidth, TypeContent } from './common.enum';

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

export interface IGetPostAboutUs extends ICommonRes {
    data: {
        pageId: number;
        contents: Array<ISection>
    };
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