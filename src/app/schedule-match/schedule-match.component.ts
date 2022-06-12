import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamDto } from '../interfaces/team-dto';
import { MatchService } from '../service/match.service';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-schedule-match',
  templateUrl: './schedule-match.component.html',
  styleUrls: ['./schedule-match.component.css'],
})
export class ScheduleMatchComponent implements OnInit {
  private userId = 0;
  private observableSubs: Subscription[] = [];
  private allTeams: TeamDto[] = [];

  public homeTeams: TeamDto[] = [];
  public awayTeams: TeamDto[] = [];

  scheduleMatchForm = new FormGroup({
    homeTeam: new FormControl(0, [Validators.required, Validators.min(1)]),
    awayTeam: new FormControl(0, [Validators.required, Validators.min(1)]),
    date: new FormControl(null, Validators.required),
    time: new FormControl(null, Validators.required),
  });

  constructor(
    private userIdService: UserIdService,
    private teamsService: TeamService,
    private matchService: MatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getAllTeams();
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
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

  private getAllTeams() {
    const teamOb = this.teamsService.getTeams(this.userId).subscribe((t) => {
      this.allTeams = t;
      this.setAwayTeams();
      this.setHomeTeams();
    });

    this.observableSubs.push(teamOb);
  }

  get homeTeam() {
    return this.scheduleMatchForm.get('homeTeam');
  }

  get awayTeam() {
    return this.scheduleMatchForm.get('awayTeam');
  }

  get date() {
    return this.scheduleMatchForm.get('date');
  }

  get time() {
    return this.scheduleMatchForm.get('time');
  }

  public onSelectChange() {
    this.setAwayTeams();
    this.setHomeTeams();
  }

  private setHomeTeams() {
    this.homeTeams = this.allTeams.filter((t) => t.id != this.awayTeam?.value);
  }

  private setAwayTeams() {
    this.awayTeams = this.allTeams.filter((t) => t.id != this.homeTeam?.value);
  }

  public onSubmit() {
    if (this.scheduleMatchForm.valid) {
      const data = {
        homeTeamId: this.homeTeam?.value,
        awayTeamId: this.awayTeam?.value,
        scheduledDateTime: `${this.date?.value}T${this.time?.value}`,
      };

      const matchOb = this.matchService
        .shceduleMatch(data, this.userId)
        .subscribe((r) => {
          this.router.navigateByUrl('/matches');
        });

      this.observableSubs.push(matchOb);
    }
  }
}
