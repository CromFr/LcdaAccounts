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

  public accountToBrowseField: string;

  ngOnInit(): void {
    this.apiService.getUser().subscribe(
      data => {
        this.user = data;
        this.accountToBrowse = data.account;
        this.accountToBrowseField = this.accountToBrowse;

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
    this.apiService.deleteAccountToken(this.user.account, this.user.token.id).subscribe(
      () => {
        localStorage.clear();
        toast('Déconnecté', 5000, 'green');
        window.location.pathname = '/';
      },
      err => {
        localStorage.clear();
        console.error('deleteAccountToken: ', err);
        window.location.pathname = '/';
      });

  }

  closeSideNav(): void {
    $('#sidebar').sideNav('hide');
  }


  onAccountToBrowseSet(): void {
    this.apiService.getAccountExists(this.accountToBrowseField).subscribe(
      (exists) => {
        if (exists === true) {
          this.accountToBrowse = this.accountToBrowseField;
          toast('Selection du compte ' + this.accountToBrowse, 5000, 'green');
          this.updateCharList();
        } else {
          toast('Compte introuvable !', 5000, 'red darken-3');
        }
      },
      err => {
        console.log(err);
      });

  }
}
