import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { MatchDto } from '../interfaces/match-dto';
import { ScoreDto } from '../interfaces/score-dto';
import { TeamDto } from '../interfaces/team-dto';
import { MatchService } from '../service/match.service';
import { ScoreService } from '../service/score.service';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-update-score',
  templateUrl: './update-score.component.html',
  styleUrls: ['./update-score.component.css'],
})
export class UpdateScoreComponent implements OnInit {
  private userId = 0;
  private matchId = 0;
  private observableSubs: Subscription[] = [];
  public match: MatchDto | undefined;
  public teams: TeamDto[] = [];

  constructor(
    private userIdService: UserIdService,
    private matchService: MatchService,
    private teamService: TeamService,
    private scoreService: ScoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.matchId = id == null ? 0 : parseInt(id);
    });
  }

  scoreForm = new FormGroup({
    innings: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(2),
    ]),
    battingTeamId: new FormControl(0, [Validators.required, Validators.min(1)]),
    runs: new FormControl(0, [Validators.required]),
    wickets: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(10),
    ]),
    overs: new FormControl(0, [Validators.required]),
    balls: new FormControl(0, [Validators.required]),
    maxOvers: new FormControl(20, [Validators.required]),
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
        this.router.navigateByUrl('/');
      } else {
        this.userId = id;
      }
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
    if (this.scoreForm.valid) {
      const data: ScoreDto = {
        matchId: this.matchId,
        innings: this.innings?.value,
        battingTeamId: this.battingTeamId?.value,
        runs: this.runs?.value,
        wickets: this.wickets?.value,
        overs: this.overs?.value,
        balls: this.balls?.value,
        maxOvers: this.maxOvers?.value,
      };

      const scoreOb = this.scoreService
        .updateScore(data, this.userId)
        .subscribe(() => {});

      this.observableSubs.push(scoreOb);
    }
  }

  public get innings() {
    return this.scoreForm.get('innings');
  }

  public get battingTeamId() {
    return this.scoreForm.get('battingTeamId');
  }

  public get runs() {
    return this.scoreForm.get('runs');
  }

  public get wickets() {
    return this.scoreForm.get('wickets');
  }

  public get balls() {
    return this.scoreForm.get('balls');
  }

  public get overs() {
    return this.scoreForm.get('overs');
  }

  public get maxOvers() {
    return this.scoreForm.get('maxOvers');
  }
}
