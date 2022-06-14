import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { ScheduleMatchComponent } from './schedule-match/schedule-match.component';
import { StartMatchComponent } from './start-match/start-match.component';
import { StopMatchComponent } from './stop-match/stop-match.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    TeamsComponent,
    MatchesComponent,
    AddTeamComponent,
    ScheduleMatchComponent,
    StartMatchComponent,
    StopMatchComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'teams/add', component: AddTeamComponent },
      { path: 'matches', component: MatchesComponent },
      { path: 'matches/schedule', component: ScheduleMatchComponent },
      { path: 'matches/start/:id', component: StartMatchComponent },
      { path: 'matches/stop/:id', component: StopMatchComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
