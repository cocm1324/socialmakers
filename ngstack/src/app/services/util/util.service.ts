import { Injectable } from '@angular/core';
import { ISectionWithContentId } from '@models';

@Injectable({
  	providedIn: 'root'
})
export class UtilService {

	constructor() { }

	contentSerializer(a: ISectionWithContentId, b: ISectionWithContentId): number {
		const diff = a.seqBase != 0 && b.seqBase != 0 ? a.seq / a.seqBase - b.seq / b.seqBase : -1;
		if (diff < 0) {
			return -1;
		}
		if (diff > 0) {
			return 1;
		}
		return 0;
	}
	
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
		const difference = curDateTime.valueOf() - dateTime.valueOf();

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

	backgroundReactiveFontColor(backgroundColor: string): string {
		const inverse = (r, g, b) => {
			return 255 - Math.floor((r + g + b) / 3);
		}
		const triple = (str) => {
			return str + str + str;
		}

		if (backgroundColor.length == 7) {
			const r = parseInt('0x' + backgroundColor[1]) * 16 + parseInt('0x' + backgroundColor[2]);
			const g = parseInt('0x' + backgroundColor[3]) * 16 + parseInt('0x' + backgroundColor[4]);
			const b = parseInt('0x' + backgroundColor[5]) * 16 + parseInt('0x' + backgroundColor[6]);
			return '#' + triple(inverse(r, g, b).toString(16).toUpperCase());
		} else if (backgroundColor.length == 4) {
			const r = parseInt('0x' + backgroundColor[1]);
			const g = parseInt('0x' + backgroundColor[2]);
			const b = parseInt('0x' + backgroundColor[3]);
			return '#' + triple(inverse(r, g, b).toString(16).toUpperCase());
		} else {
			return '#000000';
		}
	}
}
