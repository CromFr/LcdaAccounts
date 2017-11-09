import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home.component';
import { NewAccountComponent } from './pages/newaccount.component';
import { AccountComponent } from './pages/account.component';
import { CharListComponent } from './pages/char-list.component';
import { CharDetailsComponent } from './pages/char-details.component';

import { ApiService } from './api.service';

const routes = [
  {path: '', component: HomeComponent, useAsDefault: true},
  {path: 'newaccount', component: NewAccountComponent},
  {path: ':account/account', component: AccountComponent},
  {path: ':account/vault', component: CharListComponent},
  {path: ':account/vault/:character', component: CharDetailsComponent},
  // {path: ':account/backupvault/:char', component: CharDetailsComponent, data: {deleted: true}},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewAccountComponent,
    AccountComponent,
    CharListComponent,
    CharDetailsComponent,
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
  ],
  exports: [ RouterModule ],
  providers: [ ApiService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
