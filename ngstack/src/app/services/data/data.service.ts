import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IRunLoginReq, IRunLoginRes, IRunVerifyLoginRes, ICreateImageReq, IGetPostAboutUs, ICreateSectionReq, IUpdateSectionReq, IDeleteSectionReq, ICommonRes} from '../../models';
import { map } from 'rxjs/operators';

@Injectable({
  	providedIn: 'root'
})
export class DataService {
	private userUrl = "/api/user";
	private imageUrl = "/api/image";
	private postUrl = "/api/page";

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

	getAboutUs() {
		return this.http.get<IGetPostAboutUs>(`${this.postUrl}/aboutUs`);
	}

	createSection(request: ICreateSectionReq): Observable<ICommonRes> {
		const {pageId, seq} = request;
		return this.http.post<ICommonRes>(`${this.postUrl}/${pageId}/${seq}`, request);
	}

	updateSection(request: IUpdateSectionReq): Observable<ICommonRes> {
		const {pageId, seq} = request;
		return this.http.put<ICommonRes>(`${this.postUrl}/${pageId}/${seq}`, request);
	}

	deleteSection(request: IDeleteSectionReq): Observable<ICommonRes> {
		const {pageId, seq} = request;
		return this.http.delete<ICommonRes>(`${this.postUrl}/${pageId}/${seq}`);
	}
}
