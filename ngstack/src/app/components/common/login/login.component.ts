import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginFormGroup: FormGroup;

	constructor(
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.loginFormGroup = this.fb.group({
			id: ["", Validators.required],
			password: ["", Validators.required]
		});
	}

	
}
