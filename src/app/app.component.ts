import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { toast } from 'angular2-materialize';

import { ApiService, UserInfo, LightCharacter } from './api.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  constructor(private apiService: ApiService) { }


  public user: UserInfo = {
    account: '',
    isAdmin: false,
    token: null
  };

  public accountToBrowse: string;

  public charList: LightCharacter[];


  ngOnInit(): void {
    this.apiService.getUser().subscribe(
      data => {
        this.user = data;
        this.accountToBrowse = data.account;

        if (this.user.account !== '') {
          this.updateCharList();
        }
      },
      err => {
        console.error('getUser: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }

  public updateCharList(): void {
    this.apiService.getCharList(this.accountToBrowse, false).subscribe(
      list => {
        this.charList = list;
      },
      err => {
        console.error('getCharList: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
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
