import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginDto } from '../interfaces/login-dto';
import { UserIdService } from '../service/user-id.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  private observableSubs: Subscription[] = [];

  constructor(
    private userService: UserService,
    private userIdService: UserIdService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const data: LoginDto = {
        email: this.email?.value,
        password: this.password?.value,
      };

      const loginOb = this.userService.login(data).subscribe((res) => {
        this.userIdService.setUserId(res.id);
        this.router.navigateByUrl('/');
      });

      this.observableSubs.push(loginOb);
    }
  }
}
