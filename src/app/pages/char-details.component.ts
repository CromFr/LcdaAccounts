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

  public formSubtitle: string;
  public questFilter = {
    unknown: true,
    pending: true,
    finished: true,
  };
  public dungeonFilter = {
    hasMissingKinder: false,
    hasDifficulties: false,
  };
  public formNotes: string;



  constructor(public apiService: ApiService, public appComponent: AppComponent, public route: ActivatedRoute, public router: Router) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((newParamMap) => {
        this.account = newParamMap.get('account');
        this.bicFileName = newParamMap.get('character');
        this.backupChar = this.route.snapshot.data.backupChar;

        this.updateCharacter();
        this.updateMetadata();

      });

  }

  private updateCharacter(): void {
    this.apiService.getCharDetails(this.account, this.bicFileName, this.backupChar).subscribe(
      data => {
        this.character = data;
      },
      err => {
        console.error('getCharDetails: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }
  private updateMetadata(): void {
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
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }

  controlsDisabled(): boolean {
    return !(this.appComponent.user.account !== '' && (this.appComponent.user.isAdmin || this.account === this.appComponent.user.account));
  }

  downloadLink(): string {
    const url = new URL(
      '/' + (this.backupChar ? 'backupvault' : 'vault') + '/' + this.account + '/' + this.bicFileName + '/download',
      environment.api_url);

    if (this.appComponent.user.isAdmin && this.account !== this.appComponent.user.account) {
      url.searchParams.set('private-token', localStorage.getItem('auth-token'));
    }

    return url.href;
  }

  abilityModifier(value: number): string {
    const mod = Math.floor(value / 2) - 5;
    return (mod >= 0 ? '+' : '') + String(mod);
  }

  questList(): Character.JournalEntry[] {
    if (this.character) {
      return this.character.journal
        .filter((q) => {
          return (this.questFilter.unknown && q.state === 0)
              || (this.questFilter.pending && q.state === 1)
              || (this.questFilter.finished && q.state === 2);
        })
        .sort((a, b) => a.name.localeCompare(b.name));
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
  featList(category: string): Character.Feat[] {
    if (this.character) {

      return this.character.feats
        .filter((feat) => feat.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));
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

    this.setMetadata(newMetadata, true);
  }
  setSubNotes(notes: string): void {
    const newMetadata = this.meta;
    newMetadata.notes = notes;

    this.setMetadata(newMetadata);
  }

  deleteChar(): void {
    this.apiService.postCharDelete(this.account, this.bicFileName).subscribe(
      (movedInfo) => {
        this.router.navigate(['/', movedInfo.account, movedInfo.isDisabled ? 'backupvault' : 'vault', movedInfo.bicFileName]);
        toast('Personnage désactivé', 3000, 'green');
        this.backupChar = true;

        this.appComponent.updateCharList();
      },
      err => {
        console.error('postCharDelete: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }
  activateChar(): void {
    this.apiService.postCharRestore(this.account, this.bicFileName).subscribe(
      (movedInfo) => {
        this.router.navigate(['/', movedInfo.account, movedInfo.isDisabled ? 'backupvault' : 'vault', movedInfo.bicFileName]);
        toast('Personnage re-activé', 3000, 'green');
        this.backupChar = false;

        this.appComponent.updateCharList();
      },
      err => {
        console.error('postCharRestore: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }


  setMetadata(metadata: CharMetadata, updateLeftMenu: boolean = false): void {
    this.apiService.postCharMetadata(this.account, this.bicFileName, metadata, this.backupChar).subscribe(
      () => {
        toast('Sauvegardé', 3000, 'green');
        this.updateMetadata();
        if (updateLeftMenu === true) {
          this.appComponent.updateCharList();
        }
      },
      err => {
        console.error('postCharMetadata: ', err);
        toast('Error: ' + err.status + ' (' + err.statusText + ')', 5000, 'red darken-3');
      });
  }





  public difficulties = [
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
  public featCategories = [
    { value: 'HISTORY_FT_CAT',       name: 'Traits de personnalité'},
    { value: 'BACKGROUND_FT_CAT',    name: 'Dons historiques'},
    { value: 'GENERAL_FT_CAT',       name: 'Dons généraux'},
    { value: 'PROFICIENCY_FT_CAT',   name: 'Dons d\'armes et armures'},
    { value: 'SPELLCASTING_FT_CAT',  name: 'Dons de magie'},
    { value: 'METAMAGIC_FT_CAT',     name: 'Dons de métamagie'},
    { value: 'ITEMCREATION_FT_CAT',  name: 'Dons de création d\'objets'},
    { value: 'DIVINE_FT_CAT',        name: 'Dons divins'},
    { value: 'SKILLNSAVE_FT_CAT',    name: 'Dons de compétences et de sauvegarde'},
    { value: 'RACIALABILITY_FT_CAT', name: 'Aptitudes raciales'},
    { value: 'HERITAGE_FT_CAT',      name: 'Dons d\'héritage'},
    { value: 'CLASSABILITY_FT_CAT',  name: 'Pouvoirs de classe'},
    { value: 'EPIC_FT_CAT',          name: 'Dons épiques'},
    { value: 'TEAMWORK_FT_CAT',      name: 'Dons d\'équipe'},
  ];



}
