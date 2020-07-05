import { Component, OnInit } from '@angular/core';
import { ISection } from '@app/models';

const courseData = {
	status: true,
	data: {
		pageId: 2,
		pageName: "HTML & CSS",
		pageType: "COURSES",
		pageThumb: "/api/static/image/MjIzMERBNzhFOEIxMjQzQUUwRDlEQTExQzg3N0VFMUQ=.gif",
		pageThumbId: 5,
		pageHeader: "/api/static/image/RTJFMUEwNUFCRERGMzlBMkNGMEQyODJFQUVFNTA5OEI=.jpg",
		pageHeaderId: 4,
		course: {
			url: "http://google.com",
			description1: "메이커를 꿈꾸는 중고생 청소년들을 위한\n 웹 디자인 기초과정 Online Live Class",
			description2: "웹페이지의 제작의 기본 HTML & CSS,\nHTML과 CSS는 어떻게 다르고, 왜 공부해야 할까요?\n사람들의 정보공유를 위해 만들어진\n세상의 모든 웹페이지가\nHTML & CSS를 사용해서 만들어지고 있습니다.",
			fieldTitle1: "일시",
			fieldTitle2: "교육기간",
			fieldTitle3: "교육인원",
			fieldTitle4: "수업방식",
			fieldTitle5: "멘토링",
			fieldTitle6: "참가문의",
			field1: "7월 (총 6회 주 2회 실행)",
			field2: "PM 10시 – 11시 30분",
			field3: "10명",
			field4: "실시간 Zoom 온라인 라이브 강좌",
			field5: "온라인 라이브로 1:1 멘토링 수업신청가능",
			field6: "02-871-2125/ibridge.edu@gmail.com",
		},
		contents: [
			{
				contentId: 5,
				seq: 0,
				width: 0,
				type: 1,
				content: "/api/static/image/QUY4ODE3NzE3QzA1ODFBNEI3NjBEOUJDMkQxREExNjU=.jpg",
				imageId: 1
			},
			{
				contentId: 7,
				seq: 1,
				width: 0,
				type: 1,
				content: "/api/static/image/RDUyOTY3RjQ3REREMDA4MzhDM0YxNzU5MUZCN0NCNUE=.jpg",
				imageId: 2
			},
			{
				contentId: 8,
				seq: 2,
				width: 0,
				type: 1,
				content: "/api/static/image/RjcwNzdGMTY5RkZGMjJBNUFFNTEzOTdCMzFFOUY1N0Q=.png",
				imageId: 3
			}
		]
	}
}

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

	pageName: string;
	description1: string;
	description2: string;
	pageHeader: string;
	fieldTitle1: string;
	fieldTitle2: string;
	fieldTitle3: string;
	fieldTitle4: string;
	fieldTitle5: string;
	fieldTitle6: string;
	field1: string;
	field2: string;
	field3: string;
	field4: string;
	field5: string;
	field6: string;
	url: string;
	contents: ISection[];

	constructor() { }

	ngOnInit() {
		this.pageName = courseData.data.pageName;
		this.description1 = courseData.data.course.description1;
		this.description2 = courseData.data.course.description2;
		this.pageHeader = courseData.data.pageHeader;
		this.field1 = courseData.data.course.field1;
		this.field2 = courseData.data.course.field2;
		this.field3 = courseData.data.course.field3;
		this.field4 = courseData.data.course.field4;
		this.field5 = courseData.data.course.field5;
		this.field6 = courseData.data.course.field6;
		this.fieldTitle1 = courseData.data.course.fieldTitle1;
		this.fieldTitle2 = courseData.data.course.fieldTitle2;
		this.fieldTitle3 = courseData.data.course.fieldTitle3;
		this.fieldTitle4 = courseData.data.course.fieldTitle4;
		this.fieldTitle5 = courseData.data.course.fieldTitle5;
		this.fieldTitle6 = courseData.data.course.fieldTitle6;
		this.url = courseData.data.course.url;
		this.contents = courseData.data.contents;
	}

}
