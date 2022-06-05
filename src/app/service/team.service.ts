import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTeamDto } from '../interfaces/create-team-dto';
import { TeamDto } from '../interfaces/team-dto';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private baseUrl = '/api/teams';

  constructor(private http: HttpClient) {}

  addTeam(data: CreateTeamDto, userId: number) {
    return this.http.post<TeamDto>(this.baseUrl, data, {
      headers: { userId: `${userId}` },
    });
  }
}
