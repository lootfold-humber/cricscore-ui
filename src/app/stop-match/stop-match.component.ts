import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { MatchDto } from '../interfaces/match-dto';
import { TeamDto } from '../interfaces/team-dto';
import { MatchService } from '../service/match.service';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-stop-match',
  templateUrl: './stop-match.component.html',
  styleUrls: ['./stop-match.component.css'],
})
export class StopMatchComponent implements OnInit {
  private userId = 0;
  private matchId = 0;
  private observableSubs: Subscription[] = [];
  public match: MatchDto | undefined;
  public teams: TeamDto[] = [];

  constructor(
    private userIdService: UserIdService,
    private matchService: MatchService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.matchId = id == null ? 0 : parseInt(id);
    });
  }

  stopForm = new FormGroup({
    winningTeamId: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  ngOnInit(): void {
    this.getUserId();
    this.getMatch();
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private getUserId() {
    const userOb = this.userIdService.getUserId().subscribe((id) => {
      if (id == 0) {
        this.router.navigateByUrl('/login');
      }

      this.userId = id;
    });

    this.observableSubs.push(userOb);
  }

  private getMatch() {
    const matchOb = this.matchService.getMatches();
    const teamOb = this.teamService.getTeams(this.userId);

    const ob = forkJoin([matchOb, teamOb]).subscribe(([matches, teams]) => {
      this.match = matches
        .filter((m) => m.userId === this.userId && m.id == this.matchId)
        .map((m) => {
          return {
            homeTeamId: m.homeTeamId,
            awayTeamId: m.awayTeamId,
            homeTeamName: teams.filter((t) => t.id === m.homeTeamId)[0].name,
            awayTeamName: teams.filter((t) => t.id === m.awayTeamId)[0].name,
            userId: m.userId,
            id: m.id,
            scheduledDateTime: m.scheduledDateTime,
            winningTeamId: m.winningTeamId,
          };
        })[0];

      this.teams.push(teams.filter((t) => t.id == this.match?.awayTeamId)[0]);
      this.teams.push(teams.filter((t) => t.id == this.match?.homeTeamId)[0]);
    });

    this.observableSubs.push(ob);
  }

  public getFormattedDate(dateStr: string | undefined) {
    if (dateStr !== undefined) {
      return new Date(dateStr).toLocaleString();
    } else {
      return '';
    }
  }

  public onSubmit() {
    if (this.stopForm.valid) {
      const stopOb = this.matchService
        .completeMatch(this.matchId, this.stopForm.value, this.userId)
        .subscribe(() => {
          this.router.navigateByUrl('/matches');
        });
      this.observableSubs.push(stopOb);
    }
  }

  get winningTeamId() {
    return this.stopForm.get('winningTeamId');
  }
}
