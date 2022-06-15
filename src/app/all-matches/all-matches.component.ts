import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { MatchDto } from '../interfaces/match-dto';
import { MatchService } from '../service/match.service';
import { TeamService } from '../service/team.service';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.css'],
})
export class AllMatchesComponent implements OnInit, OnDestroy {
  private userId = 0;
  private observableSubs: Subscription[] = [];
  public matches: MatchDto[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMatches();
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private getMatches() {
    const matchOb = this.matchService.getMatches();
    const teamOb = this.teamService.getAllTeams();

    const ob = forkJoin([matchOb, teamOb]).subscribe(([matches, teams]) => {
      this.matches = matches.map((m) => {
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
      });
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

  onViewScore(matchId: number) {
    this.router.navigateByUrl(`/score/${matchId}`);
  }
}
