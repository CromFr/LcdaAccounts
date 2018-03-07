import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';



export enum TokenType {
  admin, restricted
}
export interface Token {
  id: number;
  name: string;
  type: TokenType;
  lastUsed: string;
}
export interface UserInfo {
  account: string;
  isAdmin: boolean;
  token: Token;
}



export module Character {
  export interface Class {
    name: string;
    lvl: number;
  }
  export interface Feat {
    name: string;
    category: string;
    icon: string;
  }
  export interface Skill {
    name: string;
    icon: string;
    rank: number;
    abilityIndex: number;
  }
  export interface LevelingSkill {
    skillIndex: number;
    value: number;
    valueDiff: number;
  }
  export interface Level {
    classIndex: number;
    ability: string;
    skills: LevelingSkill[];
    featIndices: number[];
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
    unlockedDiff: number;
  }
}
export interface Character {
  name: string;
  lvl: number;
  feats: Character.Feat[];
  skills: Character.Skill[];
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

  metadata: CharMetadata;
}
export interface CharMetadata {
  isPublic: boolean;
  subTitle: string;
  notes: string;
}
export interface MovedCharInfo {
  account: string;
  bicFileName: string;
  isDisabled: boolean;
  path: string;
}


@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    let ret = new HttpHeaders();

    const token = localStorage.getItem('auth-token');
    if (token !== null) {
      ret = ret.set('PRIVATE-TOKEN', token);
    }

    return ret;
  }

  getUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(environment.api_url + '/user',
      { headers: this.authHeaders() });
  }


  getCharList(account: string, backupVault: boolean): Observable<LightCharacter[]> {
    return this.http.get<LightCharacter[]>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/',
      { headers: this.authHeaders() });
  }
  getCharDetails(account: string, char: string, backupVault: boolean): Observable<Character> {
    return this.http.get<Character>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char,
      { headers: this.authHeaders() });
  }
  getCharMetadata(account: string, char: string, backupVault: boolean): Observable<CharMetadata> {
    return this.http.get<CharMetadata>(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char + '/meta',
      { headers: this.authHeaders() });
  }
  postCharMetadata(account: string, char: string, metadata: CharMetadata, backupVault: boolean): Observable<any> {
    return this.http.post(environment.api_url + '/' + (backupVault ? 'backupvault' : 'vault') + '/' + account + '/' + char + '/meta',
      {
        metadata: metadata
      },
      {
        headers: this.authHeaders(),
        responseType: 'text',
      });
  }

  postCharDelete(account: string, char: string): Observable<MovedCharInfo> {
    return this.http.post<MovedCharInfo>(environment.api_url + '/vault/' + account + '/' + char + '/delete',
      null,
      {
        headers: this.authHeaders()
      });
  }
  postCharRestore(account: string, char: string): Observable<MovedCharInfo> {
    return this.http.post<MovedCharInfo>(environment.api_url + '/backupvault/' + account + '/' + char + '/restore',
      null,
      {
        headers: this.authHeaders()
      });
  }




  getAccountExists(account: string): Observable<boolean> {
    return this.http.get<boolean>(environment.api_url + '/account/' + account,
      { headers: this.authHeaders() });
  }
  setAccountPassword(account: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(environment.api_url + '/account/' + account + '/password',
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: this.authHeaders(),
        responseType: 'text',
      });
  }

  getAccountTokenList(account: string): Observable<Token[]> {
    return this.http.get<Token[]>(environment.api_url + '/account/' + account + '/tokens',
      { headers: this.authHeaders() });
  }
  deleteAccountToken(account: string, tokenId: number): Observable<any> {
    return this.http.delete(environment.api_url + '/account/' + account + '/tokens/' + tokenId,
      {
        headers: this.authHeaders(),
        responseType: 'text',
      });
  }

}
