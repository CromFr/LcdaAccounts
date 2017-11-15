import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { toast } from 'angular2-materialize';

import { ApiService, Character, CharMetadata } from '../api.service';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';

declare var $: any;

@Component({
  templateUrl: './char-details.component.html',
  styleUrls: [ './char-details.component.scss' ]
})
export class CharDetailsComponent implements OnInit {

  public account: string;
  public bicFileName: string;
  public backupChar = false;

  public character: Character;
  public meta: CharMetadata;

  private formSubtitle: string;
  private classColors: any = {};
  private questFilter = {
    unknown: true,
    pending: true,
    finished: true,
  };
  private dungeonFilter = {
    hasMissingKinder: false,
    hasDifficulties: false,
  };
  private formNotes: string;



  constructor(private apiService: ApiService, private appComponent: AppComponent, private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    this.account = this.route.snapshot.paramMap.get('account');
    this.bicFileName = this.route.snapshot.paramMap.get('character');

    this.apiService.getCharDetails(this.account, this.bicFileName, this.backupChar).subscribe(
      data => {
        for (let i = 0; i < data.classes.length; ++i) {
          let c: string;
          switch (i) {
            case 0: c = 'blue lighten-3'; break;
            case 1: c = 'green lighten-3'; break;
            case 2: c = 'red lighten-3'; break;
            case 3: c = 'purple lighten-3'; break;
          }
          this.classColors[data.classes[i].name] = c;
        }
        console.log(this.classColors);
        this.character = data;
      },
      err => {
        console.error('getCharDetails: ', err);
        toast('Error: ' + err.error, 5000, 'red darken-3');
      });

    this.updateMetadata();
  }

  private updateMetadata() {
    this.apiService.getCharMetadata(this.account, this.bicFileName, this.backupChar).subscribe(
      data => {
        this.meta = data;
        this.formSubtitle = this.meta.subTitle;
        this.formNotes = this.meta.notes;

        $('#notes-content').val(this.meta.notes);
        $('#notes-content').trigger('autoresize');
      },
      err => {
        console.error('getCharMetadata: ', err);
        toast('Error: ' + err.error, 5000, 'red darken-3');
      });
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

  questList(): Character.JournalEntry[] {
    if (this.character) {
      return this.character.journal
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((q) => {
          return (this.questFilter.unknown && q.state === 0)
              || (this.questFilter.pending && q.state === 1)
              || (this.questFilter.finished && q.state === 2);
        });
    }
    return [];
  }
  dungeonList(): Character.DungeonStatus[] {
    if (this.character) {
      return this.character.dungeons
        .filter((d) => {
          if (this.dungeonFilter.hasDifficulties) {
            if (d.diffMax === 0) {
              return false;
            }
          }
          if (this.dungeonFilter.hasMissingKinder) {
            let foundMissing = false;
            for (let i = 0; i <= d.diffMax; ++i) {
              if (d.lootedChests[i] === false) {
                foundMissing = true;
                break;
              }
            }
            if (foundMissing === false) {
              return false;
            }
          }
          return true;
        });
    }
    return [];
  }

  setPublic(isPublic: boolean = false): void {
    const newMetadata = this.meta;
    newMetadata.isPublic = isPublic;

    this.setMetadata(newMetadata);
  }
  setSubTitle(subTitle: string): void {
    const newMetadata = this.meta;
    newMetadata.subTitle = subTitle;

    this.setMetadata(newMetadata);
  }
  setSubNotes(notes: string): void {
    const newMetadata = this.meta;
    newMetadata.notes = notes;

    this.setMetadata(newMetadata);
  }

  deleteChar(): void {
    toast('Not implemented', 5000, 'red');
  }
  activateChar(): void {
    toast('Not implemented', 5000, 'red');
  }


  private setMetadata(metadata: CharMetadata): void {
    this.apiService.postCharMetadata(this.account, this.bicFileName, metadata, this.backupChar).subscribe(
      () => {
        toast('Sauvegardé', 3000, 'green');
        this.updateMetadata();
      },
      err => {
        console.error('postCharMetadata: ', err);
        toast('Error: ' + err.error, 5000, 'red darken-3');
      });
  }





  private difficulties = [
    {
      id: 0,
      name: 'Normal',
      color: 'white',
    },
    {
      id: 1,
      name: 'Difficile',
      color: 'cyan',
    },
    {
      id: 2,
      name: 'Epique',
      color: 'yellow',
    },
    {
      id: 3,
      name: 'Légendaire',
      color: 'orange',
    },
    {
      id: 4,
      name: 'Inimaginable',
      color: 'red',
    }
  ];



}
