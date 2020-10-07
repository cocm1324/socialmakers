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

export interface NoticeBanner extends Banner {
    noticeName?: string;
    creationDateTime?: string;
    updateDateTime?: string;
}