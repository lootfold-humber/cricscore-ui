import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamDto } from '../interfaces/team-dto';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  private userId = 0;
  private observableSubs: Subscription[] = [];
  teams: TeamDto[] = [];

  constructor(
    private userIdService: UserIdService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getTeams();
  }

  private getUserId() {
    const userOb = this.userIdService.getUserId().subscribe((id) => {
      if (id == 0) {
        this.router.navigateByUrl('/');
      }

      this.userId = id;
    });

    this.observableSubs.push(userOb);
  }

  getTeams() {
    const getTeamsOb = this.teamService
      .getTeams(this.userId)
      .subscribe((teams) => (this.teams = teams));

    this.observableSubs.push(getTeamsOb);
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onDelete(teamId: number) {
    const deleteOb = this.teamService
      .deleteTeam(teamId, this.userId)
      .subscribe(() => {
        this.getTeams();
      });

    this.observableSubs.push(deleteOb);
  }
}
