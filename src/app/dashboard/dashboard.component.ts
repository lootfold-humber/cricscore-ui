import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private observableSubs: Subscription[] = [];

  constructor(private userIdService: UserIdService, private router: Router) {}

  ngOnInit(): void {
    const userOb = this.userIdService.getUserId().subscribe((id) => {
      if (id == 0) {
        this.router.navigateByUrl('/');
      }
    });

    this.observableSubs.push(userOb);
  }

  ngOnDestroy(): void {
    this.observableSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
