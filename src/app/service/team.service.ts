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

  getTeams(userId: number) {
    return this.http.get<TeamDto[]>(this.baseUrl, {
      headers: { userId: `${userId}` },
    });
  }

  getAllTeams() {
    return this.http.get<TeamDto[]>(`${this.baseUrl}/all`);
  }

  deleteTeam(teamId: number, userId: number) {
    return this.http.delete(`${this.baseUrl}/${teamId}`, {
      headers: { userId: `${userId}` },
    });
  }
}
