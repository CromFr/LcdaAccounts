import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { toast } from 'angular2-materialize';

import { ApiService, LightCharacter } from '../api.service';
import { AppComponent } from '../app.component';

@Component({
    templateUrl: './char-list.component.html'
})
export class CharListComponent implements OnInit {

  public account: string;
  public backupChars: LightCharacter[];


  constructor(private appComponent: AppComponent, private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    console.log(this.route);
    this.account = this.route.snapshot.paramMap.get('account');

    this.apiService.getCharList(this.account, true).subscribe(
      list => {
        this.backupChars = list;
      },
      err => {
        console.error('getCharList: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }

  gotoCharDetails(character: LightCharacter, deleted: boolean) {
    this.router.navigate(['/', this.account, deleted ? 'backupvault' : 'vault', character.bicFileName]);
  }

}
