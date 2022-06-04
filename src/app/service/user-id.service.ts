import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserIdService {
  private userId$ = new BehaviorSubject(0);

  getUserId(): Observable<number> {
    return this.userId$.asObservable();
  }

  setUserId(count: number) {
    this.userId$.next(count);
  }

  clearUserId() {
    this.setUserId(0);
  }
}
