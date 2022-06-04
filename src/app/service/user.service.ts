import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAvailibilityDto } from '../interfaces/user-availability-dto';
import { SignUpDto } from '../interfaces/sign-up-dto';
import { LoginDto } from '../interfaces/login-dto';
import { UserDto } from '../interfaces/user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  checkUserAvailability(email: string) {
    return this.http.get<UserAvailibilityDto>(
      `${this.baseUrl}/available?email=${email}`
    );
  }

  signUp(data: SignUpDto) {
    return this.http.post(this.baseUrl, data);
  }

  login(data: LoginDto) {
    return this.http.post<UserDto>(`${this.baseUrl}/login`, data);
  }
}
