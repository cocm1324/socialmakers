import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IRunLoginReq, IRunLoginRes, IRunVerifyLoginRes, ICreateImageReq, IGetAboutUsRes, ICreateSectionReq, IUpdateSectionReq, IDeleteSectionReq, ICommonRes, IGetCourseRes, IGetCourseListRes, IUpdateCourseSeqReq, IRunEyedropReq, IRunEyedropRes, IUpdateAboutUsReq} from '../../models';
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
		const {pageId, seq, seqBase} = request;
		return this.http.post<ICommonRes>(`${this.pageUrl}/${pageId}/${seq}/${seqBase}`, request);
	}

	updateSection(request: IUpdateSectionReq): Observable<ICommonRes> {
		const {pageId, seq, seqBase} = request;
		return this.http.put<ICommonRes>(`${this.pageUrl}/${pageId}/${seq}/${seqBase}`, request);
	}

	deleteSection(request: IDeleteSectionReq): Observable<ICommonRes> {
		const {pageId, seq, seqBase} = request;
		return this.http.delete<ICommonRes>(`${this.pageUrl}/${pageId}/${seq}/${seqBase}`);
	}

	getCourseList(): Observable<IGetCourseListRes> {
		return this.http.get<IGetCourseListRes>(`${this.pageUrl}/course`);
	}

	getCourse(id: number): Observable<IGetCourseRes> {
		return this.http.get<IGetCourseRes>(`${this.pageUrl}/course/${id}`);
	}

	updateCourseSeq(request: IUpdateCourseSeqReq): Observable<ICommonRes> {
		return this.http.put<ICommonRes>(`${this.pageUrl}/course/updateSeq/${request.courseId}`, request);
	}

	deleteCourse(id: number): Observable<ICommonRes> {
		return this.http.delete<ICommonRes>(`${this.pageUrl}/course/${id}`);
	}
}
