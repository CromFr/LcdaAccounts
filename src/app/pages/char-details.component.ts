import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { toast } from 'angular2-materialize';

import { ApiService, Character, CharMetadata } from '../api.service';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';

@Component({
    templateUrl: './char-details.component.html'
})
export class CharDetailsComponent implements OnInit {

  public account: string;
  public bicFileName: string;
  public backupChar = false;

  public character: Character;
  public meta: CharMetadata;


  constructor(private apiService: ApiService, private appComponent: AppComponent, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.account = this.route.snapshot.paramMap.get('account');
    this.bicFileName = this.route.snapshot.paramMap.get('character');

    this.apiService.getCharDetails(this.account, this.bicFileName, this.backupChar).subscribe(
      data => {
        this.character = data;
      },
      err => { toast('Error: ' + err, 5000, 'red'); });

    this.apiService.getCharMetadata(this.account, this.bicFileName, this.backupChar).subscribe(
      data => {
        this.meta = data;
      },
      err => { toast('Error: ' + err, 5000, 'red'); });
  }

  controlsDisabled(): boolean {
    return !(this.appComponent.user.account !== '' && (this.appComponent.user.isAdmin || this.account === this.appComponent.user.account));
  }

  downloadLink(): string {
    return environment.api_url + '/' + (this.backupChar ? 'backupvault' : 'vault') + '/' + this.account + '/' + this.bicFileName + '/download';
  }

  abilityModifier(value: number): string {
    const mod = Math.floor(value / 2) - 5;
    return (mod >= 0 ? '+' : '') + String(mod);
  }

  sortedJournalEntries(): Character.JournalEntry[] {
    if (this.character) {
      return this.character.journal.sort(function(a, b){ return a.name.localeCompare(b.name); });
    }
    return [];
  }

  setPublic(isPublic: boolean = false): void {
    toast('Not implemented', 5000, 'red');
  }

  deleteChar(): void {
    toast('Not implemented', 5000, 'red');
  }
  activateChar(): void {
    toast('Not implemented', 5000, 'red');
  }

}
