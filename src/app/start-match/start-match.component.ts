import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { MatchDto } from '../interfaces/match-dto';
import { TeamDto } from '../interfaces/team-dto';
import { TossDto } from '../interfaces/toss-dto';
import { MatchService } from '../service/match.service';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-start-match',
  templateUrl: './start-match.component.html',
  styleUrls: ['./start-match.component.css'],
})
export class StartMatchComponent implements OnInit {
  private userId = 0;
  private matchId = 0;
  private observableSubs: Subscription[] = [];
  public match: MatchDto | undefined;
  public teams: TeamDto[] = [];
  public toss: TossDto | undefined;
  public tossDecisions = [
    {
      id: 1,
      decision: 'Bat',
    },
    {
      id: 2,
      decision: 'Bowl',
    },
  ];

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

  startForm = new FormGroup({
    winningTeamId: new FormControl(0, [Validators.required, Validators.min(1)]),
    tossDecisionId: new FormControl(0, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit(): void {
    this.getUserId();
    this.getMatches();
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

  private getMatches() {
    const matchOb = this.matchService.getMatches();
    const teamOb = this.teamService.getTeams(this.userId);
    const tossOb = this.matchService.getTossForMatch(this.matchId);

    const ob = forkJoin([matchOb, teamOb, tossOb]).subscribe(
      ([matches, teams, toss]) => {
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

        this.toss = toss;
        this.startForm.get('winningTeamId')?.setValue(this.toss.winningTeamId);
        this.startForm
          .get('tossDecisionId')
          ?.setValue(this.toss.tossDecisionId);
      }
    );

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
    if (this.startForm.valid) {
      const startOb = this.matchService
        .startMatch(this.matchId, this.startForm.value, this.userId)
        .subscribe(() => {
          this.router.navigateByUrl('/matches');
        });

      this.observableSubs.push(startOb);
    }
  }

  get winningTeamId() {
    return this.startForm.get('winningTeamId');
  }

  get tossDecisionId() {
    return this.startForm.get('tossDecisionId');
  }
}
