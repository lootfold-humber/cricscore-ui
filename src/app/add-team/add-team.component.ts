import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateTeamDto } from '../interfaces/create-team-dto';
import { TeamService } from '../service/team.service';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
})
export class AddTeamComponent implements OnInit, OnDestroy {
  private userId = 0;
  private observableSubs: Subscription[] = [];

  public addTeamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private userIdService: UserIdService,
    private teamsService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
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

  get name() {
    return this.addTeamForm.get('name');
  }

  onSubmit() {
    if (this.addTeamForm.valid) {
      const data: CreateTeamDto = {
        name: this.name?.value,
      };

      const addTeamOb = this.teamsService
        .addTeam(data, this.userId)
        .subscribe(() => this.router.navigateByUrl('/teams'));

      this.observableSubs.push(addTeamOb);
    }
  }
}
