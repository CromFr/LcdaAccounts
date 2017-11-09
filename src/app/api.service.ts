import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';

export interface UserInfo {
  account: string;
  isAdmin: boolean;
  tokenName: string;
}

export module Character {
  export interface Class {
    name: string;
    lvl: number;
  }
  export interface LevelingSkill {
    name: string;
    value: number;
    valueDiff: number;
  }
  export interface Level {
    className: string;
    ability: string;
    skills: LevelingSkill[];
    feats: string[];
  }
  export interface Alignment {
    name: string;
    good_evil: number;
    law_chaos: number;
  }
  export interface Ability {
    label: string;
    value: number;
  }
  export interface JournalEntry {
    name: string;
    state: number;
    priority: number;
    description: string;
  }
  export interface DungeonStatus {
    name: string;
    areaName: string;
    diffMax: number;

    lootedChests: boolean[];
    killedBoss: boolean[];
    unlockedDiff: number;
  }
}
export interface Character {
  name: string;
  lvl: number;
  classes: Character.Class[];
  leveling: Character.Level[];
  race: string;
  alignment: Character.Alignment;
  god: string;
  abilities: Character.Ability[];
  journal: Character.JournalEntry[];
  dungeons: Character.DungeonStatus[];

  bicFile: string;
  bicFileName: string;
}

export interface LightCharacter {
  name: string;
  race: string;
  lvl: number;
  classes: Character.Class[];
  bicFileName: string;
}

export interface CharMetadata {
  isPublic: boolean;
}


@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders().set('PRIVATE-TOKEN', 'TODO');

  getUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(environment.api_url + '/user',
      { headers: this.headers });
  }


  getCharList(account: string, backupVault: boolean): Observable<LightCharacter[]> {
    return this.http.get<LightCharacter[]>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/',
      { headers: this.headers });
  }
  getCharDetails(account: string, char: string, backupVault: boolean): Observable<Character> {
    return this.http.get<Character>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char,
      { headers: this.headers });
  }
  getCharMetadata(account: string, char: string, backupVault: boolean): Observable<CharMetadata> {
    return this.http.get<CharMetadata>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char + '/meta',
      { headers: this.headers });
  }


  getAccountTokenList(account: string): Observable<string[]> {
    return this.http.get<string[]>(environment.api_url + '/account/' + account + '/token',
      { headers: this.headers });
  }

}
