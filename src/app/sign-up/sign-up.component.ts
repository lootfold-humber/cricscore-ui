import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignUpFormValidator } from './signupform.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
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
      email: new FormControl('', [Validators.required, Validators.email]),
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
