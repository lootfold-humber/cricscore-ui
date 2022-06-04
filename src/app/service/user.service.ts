import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAvailibilityDto } from '../interfaces/UserAvailibilityDto';

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
}
