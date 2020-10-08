import { Injectable } from '@angular/core';
import { AboutUsBanner, Banner, NoticeBanner } from '@app/models/';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PageEditorService {
    private banner: BehaviorSubject<Banner> = new BehaviorSubject<Banner>({});

    nextBanner(next: Banner) {
        this.banner.next(next);
    }
    getBanner(): Observable<Banner> {
        return this.banner.asObservable();
    }

}
