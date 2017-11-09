import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ApiService, Character, CharMetadata } from '../api.service';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';

import { toast } from 'angular2-materialize';

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

  tokenList: string[];

  constructor(private apiService: ApiService, private appComponent: AppComponent, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.account = this.route.snapshot.paramMap.get('account');


    this.apiService.getAccountTokenList(this.account).subscribe(
      data => {
        this.tokenList = data;
      },
      err => { toast('Error: ' + err, 5000, 'red'); });
  }

  passwordMatch(): boolean {
    return this.changePasswordForm.newPasswordCheck !== '' && this.changePasswordForm.newPassword === this.changePasswordForm.newPasswordCheck;
  }

  changePassword(): void {
    toast('Not implemented', 5000, 'red');
    this.changePasswordForm.oldPassword = '';
    this.changePasswordForm.newPassword = '';
    this.changePasswordForm.newPasswordCheck = '';
  }
  removeToken(token: string): void {
    toast('Not implemented', 5000, 'red');
  }


}
