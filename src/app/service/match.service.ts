import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatchDto } from '../interfaces/match-dto';
import { ScheduleMatchDto } from '../interfaces/schedule-match-dto';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private baseUrl = '/api/matches';

  constructor(private http: HttpClient) {}

  shceduleMatch(data: ScheduleMatchDto, userId: number) {
    return this.http.post(this.baseUrl, data, {
      headers: { userId: `${userId}` },
    });
  }

  getMatches() {
    return this.http.get<MatchDto[]>(this.baseUrl);
  }
}
