import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_TYPE } from '@app/models';

@Component({
  selector: 'app-academy-admin',
  templateUrl: './academy-admin.component.html',
  styleUrls: ['./academy-admin.component.scss']
})
export class AcademyAdminComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	goToAdmin(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin']);
	}

	goToMain(e) {
		e.preventDefault();
		this.router.navigate(['academy/admin']);
	}

	logout(e) {
		e.preventDefault();
		localStorage.removeItem(LOCAL_STORAGE_TYPE.LOGIN);
		localStorage.removeItem(LOCAL_STORAGE_TYPE.TOKEN);
		this.router.navigate(['academy']);
	}
}
