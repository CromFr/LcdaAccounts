import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { toast } from 'angular2-materialize';

import { ApiService, UserInfo } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private apiService: ApiService) { }


  public user: UserInfo = {
    account: null,
    isAdmin: false,
    tokenName: null
  };

  accountToBrowse: string;


  ngOnInit(): void {
    this.apiService.getUser().subscribe(
      user => {
        this.user = user;
        this.accountToBrowse = user.account;
        console.log('User: ', user);
        },
      err => { toast('Error: ' + err, 5000, 'red'); });
  }

  login() {
    window.location.href = environment.api_url + '/login?redirect=' + encodeURIComponent(window.location.href);
  }
}
