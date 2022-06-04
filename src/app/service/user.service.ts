import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAvailibilityDto } from '../interfaces/UserAvailibilityDto';
import { SignUpDto } from '../interfaces/SignUpDto';
import { LoginDto } from '../interfaces/login-dto';

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
    return this.http.post<SignUpDto>(this.baseUrl, data);
  }

  login(data: LoginDto) {
    return this.http.post<LoginDto>(`${this.baseUrl}/login`, data);
  }
}
