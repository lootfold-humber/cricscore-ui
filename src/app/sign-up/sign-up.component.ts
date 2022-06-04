import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { UserEmailValidator } from './email.validator';
import { SignUpFormValidator } from './signupform.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(private userEmailValidator: UserEmailValidator) {}

  signUpForm = new FormGroup(
    {
      fname: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lname: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [
          this.userEmailValidator.validate.bind(this.userEmailValidator),
        ],
        updateOn: 'blur',
      }),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    SignUpFormValidator.validatePassword
  );

  ngOnInit(): void {}

  get fname() {
    return this.signUpForm.get('fname');
  }

  get lname() {
    return this.signUpForm.get('lname');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  onSubmit() {
    console.log('submit');
    console.log(this.signUpForm);
  }
}
