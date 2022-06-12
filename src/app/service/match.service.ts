import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatchDto } from '../interfaces/match-dto';
import { ScheduleMatchDto } from '../interfaces/schedule-match-dto';
import { TossDto } from '../interfaces/toss-dto';

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

  deleteMatch(matchId: number, userId: number) {
    return this.http.delete(`${this.baseUrl}/${matchId}`, {
      headers: { userId: `${userId}` },
    });
  }

  startMatch(matchId: number, data: TossDto, userId: number) {
    return this.http.post(`${this.baseUrl}/${matchId}/start`, data, {
      headers: { userId: `${userId}` },
    });
  }

  getTossForMatch(matchId: number) {
    return this.http.get<TossDto>(`${this.baseUrl}/${matchId}/toss`);
  }
}
