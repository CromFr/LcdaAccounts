import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ApiService, Token, TokenType } from '../api.service';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';

import { toast } from 'angular2-materialize';
declare var $: any;

@Component({
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {

  account: string;

  private changePasswordForm = {
    oldPassword: '',
    newPassword: '',
    newPasswordCheck: '',
  };

  private tokenList: Token[];

  constructor(private apiService: ApiService, private appComponent: AppComponent, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.account = this.route.snapshot.paramMap.get('account');
    this.updateTokenList();
  }

  private updateTokenList(): void {
    this.apiService.getAccountTokenList(this.account).subscribe(
      data => {
        this.tokenList = data;
      },
      err => {
        console.error('getAccountTokenList: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }

  passwordMatch(): boolean {
    return this.changePasswordForm.newPasswordCheck !== '' && this.changePasswordForm.newPassword === this.changePasswordForm.newPasswordCheck;
  }

  changePassword(): void {
    this.apiService.setAccountPassword(this.account, this.changePasswordForm.oldPassword, this.changePasswordForm.newPassword).subscribe(
      () => {
        toast('Mot de passe modifié', 5000, 'green');

        this.changePasswordForm.oldPassword = '';
        this.changePasswordForm.newPassword = '';
        this.changePasswordForm.newPasswordCheck = '';
      },
      err => {
        console.error('setAccountPassword: ', err);

        let errorMessage;
        switch (err.status) {
          case 409:
            errorMessage = 'Ancien mot de passe incorrect';
            break;
          default:
            errorMessage = err.error;
        }
        toast('Impossible de changer le mot de passe: ' + errorMessage, 5000, 'red darken-3');

        this.changePasswordForm.oldPassword = '';
      });

  }
  removeToken(token: Token): void {
    this.apiService.deleteAccountToken(this.account, token.id).subscribe(
      () => {
        this.updateTokenList();
        toast('Token supprimé', 5000, 'green');
      },
      err => {
        console.error('deleteAccountToken: ', err);

        let errorMessage;
        switch (err.status) {
          case 404:
            errorMessage = 'Token (id=' + token.id + ') introuvable';
            break;
          default:
            errorMessage = err.error;
        }
        toast('Impossible de supprimer le token: ' + errorMessage, 5000, 'red darken-3');

        this.changePasswordForm.oldPassword = '';
      });
  }


}
