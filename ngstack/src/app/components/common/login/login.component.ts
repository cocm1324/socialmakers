import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@services/data/data.service';
import { IRunLoginReq, LOCAL_STORAGE_TYPE } from '@app/models';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginFormGroup: FormGroup;

	get login() {
		return this.loginFormGroup.get('login').value;
	}

	get password() {
		return this.loginFormGroup.get('password').value;
	}

	constructor(
		private fb: FormBuilder,
		private data: DataService,
		private router: Router
	) { }

	ngOnInit() {
		this.loginFormGroup = this.fb.group({
			login: ["", Validators.required],
			password: ["", Validators.required]
		});
	}

	loginButtonClicked(e) {
		e.preventDefault();

		const request: IRunLoginReq = {
			login: this.login,
			password: this.password
		};

		this.data.runLogin(request).toPromise().then(resolve => {
			console.log(resolve);
			if (!resolve.status) {
				console.log("error");
				return;
			}
			const {login, token} = resolve.data;
			localStorage.setItem(LOCAL_STORAGE_TYPE.TOKEN, token);
			localStorage.setItem(LOCAL_STORAGE_TYPE.LOGIN, login);
			if (localStorage.getItem(LOCAL_STORAGE_TYPE.CALLBACK)) {
				const callbackUrl = localStorage.getItem(LOCAL_STORAGE_TYPE.CALLBACK);
				localStorage.removeItem(LOCAL_STORAGE_TYPE.CALLBACK);
				this.router.navigate([callbackUrl]);
			} else {
				this.router.navigate(['']);
			}
		}, reject => {
			console.log(reject);
			return;
		});
	}	
}
