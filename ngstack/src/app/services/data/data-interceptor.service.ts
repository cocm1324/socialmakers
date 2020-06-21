import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LOCAL_STORAGE_TYPE } from '@app/models';

@Injectable({
  	providedIn: 'root'
})
export class DataInterceptorService implements HttpInterceptor {

	constructor() { }
	
	intercept(req, next) {
        const token = localStorage.getItem(LOCAL_STORAGE_TYPE.TOKEN);
        if (token) {
            const tokenizedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(tokenizedReq);
        } else {
            return next.handle(req);
        }
	}
}
