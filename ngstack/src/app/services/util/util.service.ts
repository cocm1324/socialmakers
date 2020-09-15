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

	dbDateTimeStringToUserReadable(dateTimeString: string): string {
		const SECOND = 1000;
		const MINUTE = SECOND * 60;
		const HOUR = MINUTE * 60;
		
		if (Date.parse(dateTimeString) == NaN) {
			return '...';
		}
		const dateTime = new Date(dateTimeString);
		const curDateTime = new Date();

		// 방금, 1분전~59분전, 1시간전 ~ 23시간전(하루가 지나기 전까지), YYYY년 MM월 DD일
		const difference = dateTime.valueOf() - curDateTime.valueOf();

		if (difference < MINUTE) {
			return '조금 전';
		} else if (MINUTE <= difference && difference < HOUR) {
			return `${Math.floor(difference / MINUTE)}분 전`;
		} else if (HOUR <= difference && dateTime.getDate() == curDateTime.getDate()) {
			return `${Math.floor(difference / HOUR)}시간 전`
		} else {
			return `${dateTime.getFullYear()}년 ${dateTime.getMonth() + 1}월 ${dateTime.getDate()}일`;
		}
	}
}
