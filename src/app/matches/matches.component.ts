import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { MatchDto } from '../interfaces/match-dto';
import { MatchService } from '../service/match.service';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
})
export class MatchesComponent implements OnInit, OnDestroy {
  private userId = 0;
  private observableSubs: Subscription[] = [];
  public matches: MatchDto[] = [];

  constructor(
    private userIdService: UserIdService,
    private matchService: MatchService,
    private teamService: TeamService,
    private router: Router
  ) {}

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

    const ob = forkJoin([matchOb, teamOb]).subscribe(([matches, teams]) => {
      this.matches = matches
        .filter((m) => m.userId === this.userId)
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
        });
    });

    this.observableSubs.push(ob);
  }

  public getFormattedDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
  }

  public onDelete(matchId: number) {
    const deleteOb = this.matchService
      .deleteMatch(matchId, this.userId)
      .subscribe(() => {
        this.getMatches();
      });

    this.observableSubs.push(deleteOb);
  }

  public onStart(matchId: number) {
    this.router.navigateByUrl(`/matches/start/${matchId}`);
  }

  public onStop(matchId: number) {
    console.log(`stop: ${matchId}`);
  }
}
