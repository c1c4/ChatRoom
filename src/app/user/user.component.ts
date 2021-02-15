import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInput } from '../model/User';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signUp(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userInput: UserInput = {
      userName: this.userForm.get('userName')?.value,
      password: this.userForm.get('password')?.value,
      email: this.userForm.get('email')?.value
    };

    this.userService.postUser(userInput).subscribe(
      _ => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
        this.router.navigate([redirect || '/'], { replaceUrl: true });
      },
      error => console.log(error)
    );


  }

}
