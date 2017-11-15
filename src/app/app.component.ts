import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { toast } from 'angular2-materialize';

import { ApiService, UserInfo } from './api.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private apiService: ApiService) { }


  public user: UserInfo = {
    account: null,
    isAdmin: false,
    token: null
  };

  accountToBrowse: string;


  ngOnInit(): void {
    this.apiService.getUser().subscribe(
      data => {
        this.user = data;
        this.accountToBrowse = data.account;
      },
      err => {
        console.error('getUser: ', err);
        toast('Error: ' + err.error, 5000, 'red darken-3');
      });
  }

  login(): void {
    const redirectTarget = new URL(window.location.href);
    redirectTarget.pathname = '/_registertoken';
    redirectTarget.searchParams.append('account-redir', window.location.pathname);

    window.location.href = environment.api_url + '/gen_token'
      + '?tokenName=' + encodeURIComponent('account.lcda-nwn2.fr')
      + '&tokenType=' + encodeURIComponent('admin')
      + '&redir=' + encodeURIComponent(redirectTarget.href);
  }

  logout(): void {
    localStorage.clear();
    this.apiService.deleteAccountToken(this.user.account, this.user.token.id);
    window.location.pathname = '/';
  }

  closeSideNav(): void {
    $('#sidebar').sideNav('hide');
  }
}
