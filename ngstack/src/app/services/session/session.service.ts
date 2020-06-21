import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
 	providedIn: 'root'
})
export class SessionService {

	private currentUserSource = new BehaviorSubject<any>({
		id: null,
		token: null
    });

    get currentUser(): Observable<any> {
		return this.currentUserSource.asObservable();
	}

  	constructor() { }
}
