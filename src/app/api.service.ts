import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  subTitle: string;
  notes: string;
}

export enum TokenType {
  admin, restricted
}
export interface Token {
  id: number;
  name: string;
  type: TokenType;
  lastUsed: string;
}


@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders().set('PRIVATE-TOKEN', 'TODO');

  getUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(environment.api_url + '/user',
      { headers: this.headers });
  }


  getCharList(account: string, backupVault: boolean = false): Observable<LightCharacter[]> {
    return this.http.get<LightCharacter[]>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/',
      { headers: this.headers });
  }
  getCharDetails(account: string, char: string, backupVault: boolean = false): Observable<Character> {
    return this.http.get<Character>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char,
      { headers: this.headers });
  }
  getCharMetadata(account: string, char: string, backupVault: boolean = false): Observable<CharMetadata> {
    return this.http.get<CharMetadata>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char + '/meta',
      { headers: this.headers });
  }
  postCharMetadata(account: string, char: string, metadata: CharMetadata, backupVault: boolean = false): Observable<any> {
    return this.http.post(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char + '/meta',
      {
        metadata: metadata
      },
      {
        headers: this.headers,
        responseType: 'text',
      });
  }




  getAccountExists(account: string): Observable<boolean> {
    return this.http.get<boolean>(environment.api_url + '/account/' + account,
      { headers: this.headers });
  }
  setAccountPassword(account: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(environment.api_url + '/account/' + account + '/password',
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: this.headers,
        responseType: 'text',
      });
  }

  getAccountTokenList(account: string): Observable<Token[]> {
    return this.http.get<Token[]>(environment.api_url + '/account/' + account + '/tokens',
      { headers: this.headers });
  }
  deleteAccountToken(account: string, tokenId: number): Observable<any> {
    return this.http.delete(environment.api_url + '/account/' + account + '/tokens/' + tokenId,
      {
        headers: this.headers,
        responseType: 'text',
      });
  }

}
