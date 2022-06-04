import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import { UserEmailValidator } from './email.validator';
import { SignUpFormValidator } from './signupform.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnDestroy {
  private observableSubs: Subscription[] = [];

  constructor(
    private userEmailValidator: UserEmailValidator,
    private userService: UserService,
    private router: Router
  ) {}

  public signUpForm = new FormGroup(
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
    if (this.signUpForm.valid) {
      const data = {
        first: this.fname?.value,
        last: this.lname?.value,
        email: this.email?.value,
        password: this.password?.value,
      };

      const signUpOb = this.userService
        .signUp(data)
        .subscribe(() => this.router.navigateByUrl('/'));

      this.observableSubs.push(signUpOb);
    }
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
