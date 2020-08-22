import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class UtilService {

	constructor() { }
	  
	smallImage(url: string): string {
		const parsed = url.split('/');
		parsed.splice(parsed.length - 1, 0, 'thumb');
		return parsed.join('/');
	}
}
