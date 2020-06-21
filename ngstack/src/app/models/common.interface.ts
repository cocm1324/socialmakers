import { Binary } from '@angular/compiler';
import { PAGE_TYPE, WIDTH_TYPE, CONTENT_TYPE } from './common.enum';

export interface ICommonRes {
    status: boolean;
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
        pageName: string;
        pageType: PAGE_TYPE;
        contents: Array<{
            contentId: number;
            seq: number;
            width: WIDTH_TYPE;
            type: CONTENT_TYPE;
            content: string;
            imageId: number;
        }>;
    }
}