import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserIdService } from '../service/user-id.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  private userId = 0;
  private observableSubs: Subscription[] = [];

  constructor(private userIdService: UserIdService, private router: Router) {}

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
      this.userId = id;
    });

    this.observableSubs.push(userOb);
  }

  get displayLogout() {
    return this.userId == 0 ? false : true;
  }

  onLogout() {
    this.userIdService.clearUserId();
    this.router.navigateByUrl('/allmatches');
  }

  onLogin() {
    this.userIdService.clearUserId();
    this.router.navigateByUrl('/login');
  }
}
