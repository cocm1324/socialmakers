import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
	IRunLoginReq, IRunLoginRes, IRunVerifyLoginRes, IGetAboutUsRes, 
	ICreateSectionReq, IUpdateSectionReq, IDeleteSectionReq, ICommonRes, IGetCourseRes, 
	IGetCourseListRes, IUpdateCourseSeqReq, IRunEyedropReq, IRunEyedropRes, IUpdateAboutUsReq, 
	IUpdateCourseInfoReq, ICreateCourseReq, ICreateCourseRes, IUpdateSectionSeqReq, 
	IGetImageListRes, IGetNoticeListRes, API_URL, IGetNoticeRes, IUpdateNoticeReq 
} from '@app/models';

@Injectable({
  	providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }

	runLogin(request: IRunLoginReq): Observable<IRunLoginRes> {
		return this.http.post<IRunLoginRes>(API_URL.USER_LOGIN, request);
	}

	runVerifyLogin(): Observable<IRunVerifyLoginRes> {
		return this.http.get<IRunVerifyLoginRes>(API_URL.USER_LOGIN);
	}

	createImage(request) {
		return this.http.post<any>(API_URL.IMAGE, request, {
			reportProgress: true,
			observe: 'events'
		}).pipe(map((event) => {
				switch (event.type) {
					case HttpEventType.UploadProgress: 
						const progress = Math.round(100 * event.loaded / event.total);
						return { status: 'progress', message: progress };
					case HttpEventType.Response:
						return event.body;
					default:
						return `Unhandled event: ${event.type}`;
				}
			})
		);
	}

	getImageList(pageCount?: number, pageNo?: number, increment?: boolean): Observable<IGetImageListRes> {
		let url = "";
		const queue = [];

		if (pageCount) {
			queue.push(`pageCount=${pageCount}`);
		}
		if (pageNo) {
			queue.push(`pageNo=${pageNo}`);
		}
		if (increment != null && increment != undefined) {
			queue.push(`increment=${increment}`);
		}

		if (queue.length > 0) {
			url += '?';
			for(let i = 0; i < queue.length; i++) {
				if (i != 0) {
					url += '&';
				}
				url += queue[i];
			}
		}

		return this.http.get<IGetImageListRes>(API_URL.IMAGE + url);
	}

	runEyeDrop(request: IRunEyedropReq): Observable<IRunEyedropRes> {
		return this.http.post<IRunEyedropRes>(API_URL.IMAGE_EYEDROP + `/${request.imageId}`, request);
	}

	getAboutUs() {
		return this.http.get<IGetAboutUsRes>(API_URL.PAGE_ABOUT_US);
	}

	updateAboutUs(request: IUpdateAboutUsReq): Observable<ICommonRes> {
		return this.http.put<ICommonRes>(API_URL.PAGE_ABOUT_US, request);
	}

	createSection(request: ICreateSectionReq): Observable<ICommonRes> {
		const {pageId} = request;
		return this.http.post<ICommonRes>(API_URL.PAGE + `/${pageId}`, request);
	}

	updateSection(request: IUpdateSectionReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE + `/${pageId}/${contentId}`, request);
	}

	deleteSection(request: IDeleteSectionReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.delete<ICommonRes>(API_URL.PAGE + `/${pageId}/${contentId}`);
	}

	updateSectionSeqUp(request: IUpdateSectionSeqReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE + `/${pageId}/${contentId}`, request);
	}

	updateSectionSeqDown(request): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE + `/${pageId}/${contentId}`, request);
	}

	getCourseList(): Observable<IGetCourseListRes> {
		return this.http.get<IGetCourseListRes>(API_URL.PAGE_COURSE);
	}

	getCourse(courseId: number): Observable<IGetCourseRes> {
		return this.http.get<IGetCourseRes>(API_URL.PAGE_COURSE + `/${courseId}`);
	}

	createCourse(request: ICreateCourseReq): Observable<ICreateCourseRes> {
		return this.http.post<ICreateCourseRes>(API_URL.PAGE_COURSE, request);
	}

	deleteCourse(courseId: number): Observable<ICommonRes> {
		return this.http.delete<ICommonRes>(API_URL.PAGE_COURSE + `/${courseId}`);
	}

	updateCourseSeqUp(request: IUpdateCourseSeqReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE_COURSE_UPSEQ + `/${courseId}`, request);
	}

	updateCourseSeqDown(request: IUpdateCourseSeqReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE_COURSE_DOWNSEQ + `/${courseId}`, request);
	}

	updateCourseInfo(request: IUpdateCourseInfoReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(API_URL.PAGE_COURSE + `/${courseId}`, request);
	}

	getNoticeList(pageCount?: number, pageNo?: number, increment?: boolean): Observable<IGetNoticeListRes> {
		let url = '';
		const queue = [];

		if (pageCount) {
			queue.push(`pageCount=${pageCount}`);
		}
		if (pageNo) {
			queue.push(`pageNo=${pageNo}`);
		}
		if (increment != null && increment != undefined) {
			queue.push(`increment=${increment}`);
		}

		if (queue.length > 0) {
			url += '?';
			for(let i = 0; i < queue.length; i++) {
				if (i != 0) {
					url += '&';
				}
				url += queue[i];
			}
		}

		return this.http.get<IGetNoticeListRes>(API_URL.PAGE_NOTICE + url);
	} 

	getNotice(noticeId: number): Observable<IGetNoticeRes> {
		return this.http.get<IGetNoticeRes>(API_URL.PAGE_NOTICE + `/${noticeId}`);
	}

	updateNotice(request: IUpdateNoticeReq): Observable<ICommonRes> {
		return this.http.put<ICommonRes>(API_URL.PAGE_NOTICE + `/${request.noticeId}`, request);
	}
}
