import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { GetScoreDto } from '../interfaces/get-score-dto';
import { MatchDto } from '../interfaces/match-dto';
import { TeamDto } from '../interfaces/team-dto';
import { MatchService } from '../service/match.service';
import { ScoreService } from '../service/score.service';
import { TeamService } from '../service/team.service';

@Component({
  selector: 'app-view-score',
  templateUrl: './view-score.component.html',
  styleUrls: ['./view-score.component.css'],
})
export class ViewScoreComponent implements OnInit, OnDestroy {
  private matchId = 0;
  private observableSubs: Subscription[] = [];
  private teams: TeamDto[] = [];
  match: MatchDto | undefined;
  score: GetScoreDto | undefined;
  interval: any;

  constructor(
    private scoreService: ScoreService,
    private teamService: TeamService,
    private matchService: MatchService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('matchId');
      this.matchId = id == null ? 0 : parseInt(id);
    });
  }

  ngOnInit(): void {
    this.getScore();
    this.interval = setInterval(() => {
      this.getScore();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  unsubscribe() {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });

    clearInterval(this.interval);
  }

  private getScore() {
    const scoreOb = this.scoreService.getScore(this.matchId);
    const teamOb = this.teamService.getAllTeams();
    const matchOb = this.matchService.getMatches();

    const ob = forkJoin([scoreOb, teamOb, matchOb]).subscribe(
      ([score, teams, matches]) => {
        this.score = score;
        this.teams = teams;
        this.match = matches.filter((m) => m.id == this.matchId)[0];
        this.match.homeTeamName = teams.filter(
          (t) => t.id == this.match?.homeTeamId
        )[0].name;
        this.match.awayTeamName = teams.filter(
          (t) => t.id == this.match?.awayTeamId
        )[0].name;

        if (this.match.winningTeamId != 0) {
          this.unsubscribe();
        }
      }
    );

    this.observableSubs.push(ob);
  }

  public getFormattedDate() {
    if (this.match != undefined) {
      return new Date(this.match.scheduledDateTime).toLocaleString();
    } else {
      return '';
    }
  }

  public getWinnerTeamName() {
    if (this.match?.winningTeamId) {
      return this.teams.filter((t) => t.id == this.match?.winningTeamId)[0]
        .name;
    } else {
      return '';
    }
  }

  public getFirstBattingTeamName() {
    if (this.score?.firstInnings) {
      return this.teams.filter(
        (t) => t.id == this.score?.firstInnings.battingTeamId
      )[0].name;
    } else {
      return '';
    }
  }

  public getSecondBattingTeamName() {
    if (this.score?.secondInnings) {
      return this.teams.filter(
        (t) => t.id == this.score?.secondInnings.battingTeamId
      )[0].name;
    } else {
      return '';
    }
  }

  public getFirstInScore() {
    if (this.score?.firstInnings) {
      const { runs, wickets, balls, overs, maxOvers } = this.score.firstInnings;
      return `Runs: ${runs}/${wickets} Overs: ${overs}.${balls}/${maxOvers}`;
    } else {
      return '';
    }
  }

  public getSecondInScore() {
    if (this.score?.secondInnings) {
      const { runs, wickets, balls, overs, maxOvers } =
        this.score.secondInnings;
      return `Runs: ${runs}/${wickets} Overs: ${overs}.${balls}/${maxOvers}`;
    } else {
      return '';
    }
  }
}
