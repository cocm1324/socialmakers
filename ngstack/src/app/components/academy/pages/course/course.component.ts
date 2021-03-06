import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISection, ISectionWithContentId } from '@app/models';
import { DataService } from '@services/data/data.service';

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
				seqBase: 1,
				width: 0,
				type: 1,
				content: "/api/static/image/QUY4ODE3NzE3QzA1ODFBNEI3NjBEOUJDMkQxREExNjU=.jpg",
				imageId: 1,
				background: "#FFFFFF"
			},
			{
				contentId: 7,
				seq: 1,
				seqBase: 1,
				width: 0,
				type: 1,
				content: "/api/static/image/RDUyOTY3RjQ3REREMDA4MzhDM0YxNzU5MUZCN0NCNUE=.jpg",
				imageId: 2,
				background: "#FFFFFF"
			},
			{
				contentId: 8,
				seq: 2,
				seqBase: 1,
				width: 0,
				type: 1,
				content: "/api/static/image/RjcwNzdGMTY5RkZGMjJBNUFFNTEzOTdCMzFFOUY1N0Q=.png",
				imageId: 3,
				background: "#FFFFFF"
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

	courseName: string;
	description1: string;
	description2: string;
	fields: any[];
	registerUrl: string;
	contents: ISection[];

	banner;

	loaded: boolean = false;

	constructor(private dataService: DataService, private route: ActivatedRoute) { }

	ngOnInit() {
		this.getCourseId();
	}

	getCourseId() {
		this.route.params.subscribe(next => {
			const { id } = next;
			this.loadData(id);
		});
	}

	loadData(id: number) {
		this.dataService.getCourse(id).toPromise().then(result => {
			const { data, status } = result;
			if (status) {
				const { 
					courseName, courseId, contents, description1, description2, registerUrl,
					field1, field2, field3, field4, field5, field6, fieldTitle1, fieldTitle2,
					fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, bannerColor, bannerImageBlur,
					bannerImageId, bannerImageUrl
				} = data;

				this.courseName = courseName;
				this.description1 = description1;
				this.description2 = description2;

				this.fields = [
					{field: field1, fieldTitle: fieldTitle1},
					{field: field2, fieldTitle: fieldTitle2},
					{field: field3, fieldTitle: fieldTitle3},
					{field: field4, fieldTitle: fieldTitle4},
					{field: field5, fieldTitle: fieldTitle5},
					{field: field6, fieldTitle: fieldTitle6}
				];
				this.registerUrl = registerUrl;

				this.banner = { bannerImageBlur, bannerImageUrl, bannerImageId, bannerColor };

				this.initContent(contents);

				this.loaded = true;
			}
		});
	}

	initContent(data: ISectionWithContentId[]) {
		data.sort((a, b)=> {
			if (a.seq - b.seq < 0) {
				return -1;
			}
			if (a.seq - b.seq > 0) {
				return 1;
			}
			return 0;
		});

		const mappedContent = data.map(content => {
			const contentMap = {
				contentId: content.contentId,
				width: content.width,
				type: content.type,
				content: content.content,
				seq: content.seq,
				seqBase: content.seqBase,
				background: content.background
			};
			if (content.imageId) {
				contentMap['imageId'] = content.imageId;
				contentMap['imageUrl'] = content.imageUrl;
			}
			return contentMap;
		});

		this.contents = mappedContent;
	}

	goToUrl() {
		window.location.href = this.registerUrl;
	}
}
