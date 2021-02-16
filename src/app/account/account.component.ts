import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';
import { OrderService } from './orders/shared/order.service';

import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public userSubscription:Subscription;
  public user: User;

  constructor(
    private authService: AuthService,
    public router: Router,
    public orderService: OrderService
  ) {}

  ngOnInit(): void {
    console.log("hmm");
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

}
