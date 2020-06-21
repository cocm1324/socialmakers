import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IRunLoginReq, IRunLoginRes, IRunVerifyLoginRes} from '../../models';

@Injectable({
  	providedIn: 'root'
})
export class DataService {
	private userUrl = "http://socialmakers.co.kr/api/user";

	constructor(private http: HttpClient) { }

	runLogin(request: IRunLoginReq): Observable<IRunLoginRes> {
		return this.http.post<IRunLoginRes>(`${this.userUrl}/login`, request);
	}

	runVerifyLogin(): Observable<IRunVerifyLoginRes> {
		return this.http.get<IRunVerifyLoginRes>(`${this.userUrl}/login`);
	}
}
