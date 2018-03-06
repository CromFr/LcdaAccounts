import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
    template: '<h1>...</h1>'
})
export class RegisterTokenComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {
    const url = new URL(window.location.href);
    const tokenValue = url.searchParams.get('token');
    const redirectTarget = url.searchParams.get('account-redir');

    localStorage.setItem('auth-token', tokenValue);
    window.location.href = window.location.origin + redirectTarget;
  }

}
