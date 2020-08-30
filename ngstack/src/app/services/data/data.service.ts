import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IRunLoginReq, IRunLoginRes, IRunVerifyLoginRes, ICreateImageReq, IGetAboutUsRes, ICreateSectionReq, IUpdateSectionReq, IDeleteSectionReq, ICommonRes, IGetCourseRes, IGetCourseListRes, IUpdateCourseSeqReq, IRunEyedropReq, IRunEyedropRes, IUpdateAboutUsReq, IUpdateCourseInfoReq, ICreateCourseReq, ICreateCourseRes, IUpdateSectionSeqReq, IGetImageListRes} from '../../models';
import { map } from 'rxjs/operators';

@Injectable({
  	providedIn: 'root'
})
export class DataService {
	private userUrl = "/api/user";
	private imageUrl = "/api/image";
	private pageUrl = "/api/page";

	constructor(private http: HttpClient) { }

	runLogin(request: IRunLoginReq): Observable<IRunLoginRes> {
		return this.http.post<IRunLoginRes>(`${this.userUrl}/login`, request);
	}

	runVerifyLogin(): Observable<IRunVerifyLoginRes> {
		return this.http.get<IRunVerifyLoginRes>(`${this.userUrl}/login`);
	}

	createImage(request) {
		return this.http.post<any>(this.imageUrl, request, {
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
		let url = `${this.imageUrl}`;
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

		return this.http.get<IGetImageListRes>(url);
	}

	runEyeDrop(request: IRunEyedropReq): Observable<IRunEyedropRes> {
		return this.http.post<IRunEyedropRes>(`${this.imageUrl}/eyedrop/${request.imageId}`, request);
	}

	getAboutUs() {
		return this.http.get<IGetAboutUsRes>(`${this.pageUrl}/aboutUs`);
	}

	updateAboutUs(request: IUpdateAboutUsReq): Observable<ICommonRes> {
		return this.http.put<ICommonRes>(`${this.pageUrl}/aboutUs`, request);
	}

	createSection(request: ICreateSectionReq): Observable<ICommonRes> {
		const {pageId} = request;
		return this.http.post<ICommonRes>(`${this.pageUrl}/${pageId}`, request);
	}

	updateSection(request: IUpdateSectionReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/${pageId}/${contentId}`, request);
	}

	deleteSection(request: IDeleteSectionReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.delete<ICommonRes>(`${this.pageUrl}/${pageId}/${contentId}`);
	}

	updateSectionSeqUp(request: IUpdateSectionSeqReq): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/${pageId}/${contentId}`, request);
	}

	updateSectionSeqDown(request): Observable<ICommonRes> {
		const {pageId, contentId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/${pageId}/${contentId}`, request);
	}

	getCourseList(): Observable<IGetCourseListRes> {
		return this.http.get<IGetCourseListRes>(`${this.pageUrl}/course`);
	}

	getCourse(courseId: number): Observable<IGetCourseRes> {
		return this.http.get<IGetCourseRes>(`${this.pageUrl}/course/${courseId}`);
	}

	createCourse(request: ICreateCourseReq): Observable<ICreateCourseRes> {
		return this.http.post<ICreateCourseRes>(`${this.pageUrl}/course`, request);
	}

	deleteCourse(courseId: number): Observable<ICommonRes> {
		return this.http.delete<ICommonRes>(`${this.pageUrl}/course/${courseId}`);
	}

	updateCourseSeqUp(request: IUpdateCourseSeqReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/course/upSeq/${courseId}`, request);
	}

	updateCourseSeqDown(request: IUpdateCourseSeqReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/course/downSeq/${courseId}`, request);
	}

	updateCourseInfo(request: IUpdateCourseInfoReq): Observable<ICommonRes> {
		const {courseId} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/course/${courseId}`, request);
	}
}
