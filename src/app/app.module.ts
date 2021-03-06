import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { ScheduleMatchComponent } from './schedule-match/schedule-match.component';
import { StartMatchComponent } from './start-match/start-match.component';
import { StopMatchComponent } from './stop-match/stop-match.component';
import { UpdateScoreComponent } from './update-score/update-score.component';
import { NavComponent } from './nav/nav.component';
import { AllMatchesComponent } from './all-matches/all-matches.component';
import { ViewScoreComponent } from './view-score/view-score.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    TeamsComponent,
    MatchesComponent,
    AddTeamComponent,
    ScheduleMatchComponent,
    StartMatchComponent,
    StopMatchComponent,
    UpdateScoreComponent,
    NavComponent,
    AllMatchesComponent,
    ViewScoreComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: AllMatchesComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'teams/add', component: AddTeamComponent },
      { path: 'matches', component: MatchesComponent },
      { path: 'matches/schedule', component: ScheduleMatchComponent },
      { path: 'matches/start/:id', component: StartMatchComponent },
      { path: 'matches/complete/:id', component: StopMatchComponent },
      { path: 'matches/score/:id', component: UpdateScoreComponent },
      { path: 'score/:matchId', component: ViewScoreComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
