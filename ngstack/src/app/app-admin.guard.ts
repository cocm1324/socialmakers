import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map, catchError, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { LOCAL_STORAGE_TYPE } from './models';
import { DataService } from '@services/data/data.service';


@Injectable({
  	providedIn: 'root'
})
export class AppAdminGuard implements CanActivate {
	constructor(
		private router: Router, 
		private dataService: DataService,
	) { }

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

		if(!localStorage.getItem(LOCAL_STORAGE_TYPE.TOKEN)) {
			this.router.navigate(['login']);
			return of(false);
        }

		return this.dataService.runVerifyLogin().pipe(
            take(1),
			map(response => {
                const {status} = response;

                if (status) {
                    const {token, login} = response.data

                    localStorage.setItem(LOCAL_STORAGE_TYPE.TOKEN, token);
                    localStorage.setItem(LOCAL_STORAGE_TYPE.LOGIN, login);

                    return response.status;

                } else {
                    localStorage.removeItem(LOCAL_STORAGE_TYPE.TOKEN);
                    localStorage.removeItem(LOCAL_STORAGE_TYPE.LOGIN);

                    return response.status;
                }
            }),
			catchError(error => {
				this.router.navigate(['login']);
				return of(false);
			})
		);
	}
}