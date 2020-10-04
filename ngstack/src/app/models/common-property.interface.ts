export interface NoticeEditorInput {
    noticeName: string;
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
    creationDateTime: string;
    updateDateTime: string;
    featured: number;
}

export interface AboutUsEditorInput {
    pageName: string;
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
}

export interface BannerInput {
    bannerImageId?: number;
    bannerImageUrl?: string;
    bannerImageBlur?: number;
    bannerColor?: string;
}