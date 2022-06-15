import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetScoreDto } from '../interfaces/get-score-dto';
import { ScoreDto } from '../interfaces/score-dto';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private baseUrl = '/api/scores';

  constructor(private http: HttpClient) {}

  updateScore(data: ScoreDto, userId: number) {
    return this.http.post(this.baseUrl, data, {
      headers: { userId: `${userId}` },
    });
  }

  getScore(matchId: number) {
    return this.http.get<GetScoreDto>(`${this.baseUrl}/${matchId}`);
  }
}
