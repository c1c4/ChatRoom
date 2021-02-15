import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const userName = this.loginForm.get('userName')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loginService.login(userName, password).subscribe(
      user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['chatRoom']);
      },
      error => console.log(error)
    );
  }

  singUp() {
    this.router.navigate(['registration']);
  }

}
