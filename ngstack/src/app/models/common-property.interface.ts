export interface BannerInput {
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
}

export interface NoticeEditorInput {
    noticeName?: string;
    creationDateTime?: string;
    updateDateTime?: string;
}

export interface AboutUsEditorInput {
    pageName?: string;
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
}

export interface Banner {
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
}

export interface AboutUsBanner extends Banner {
    pageName?: string;
}

export interface CourseBanner extends Banner {
    courseName?: string;
    description1?: string;
    description2?: string;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    field5?: string;
    field6?: string;
    fieldTitle1?: string;
    fieldTitle2?: string;
    fieldTitle3?: string;
    fieldTitle4?: string;
    fieldTitle5?: string;
    fieldTitle6?: string;
    registerUrl?: string;
}

export interface NoticeBanner extends Banner {
    noticeName?: string;
    creationDateTime?: string;
    updateDateTime?: string;
}