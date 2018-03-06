import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { toast } from 'angular2-materialize';

import { ApiService, LightCharacter } from '../api.service';
import { AppComponent } from '../app.component';

@Component({
  templateUrl: './char-list.component.html',
  styleUrls: [ './char-list.component.scss' ]
})
export class CharListComponent implements OnInit {

  public account: string;
  public activeChars: LightCharacter[];
  public backupChars: LightCharacter[];


  constructor(public appComponent: AppComponent, public apiService: ApiService, public route: ActivatedRoute, public router: Router) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe((newParamMap) => {
      this.account = newParamMap.get('account');

      this.apiService.getCharList(this.account, false).subscribe(
        list => {
          this.activeChars = list;
        },
        err => {
          console.error('getCharList(active): ', err);
          toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
        });

      this.apiService.getCharList(this.account, true).subscribe(
        list => {
          this.backupChars = list;
        },
        err => {
          console.error('getCharList(backup): ', err);
          toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
        });
    });
  }

  gotoCharDetails(character: LightCharacter, deleted: boolean) {
    this.router.navigate(['/', this.account, deleted ? 'backupvault' : 'vault', character.bicFileName]);
  }

}
