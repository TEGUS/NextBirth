import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {currentHost} from "../host/host";
import {Observable} from "rxjs/Observable";
import {Headers} from "@angular/http";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  host: any;
  headers: any;

  constructor(public http: HttpClient) {
    this.headers = this.initHeaders();

    this.host = currentHost;
  }

  initHeaders(login?, pwd?) {
    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (login && pwd) {
      headers['Authorization'] = 'Basic ' + btoa(login + ':' + pwd);
    }

    return {
      headers: new HttpHeaders(headers)
    };
  }

  logIn(user: any): Observable<any> {
    return this.http.post(
      this.host + 'auth',
      null,
      this.initHeaders(user.email, user.plainPassword)
    );
  }

  signUp(user: any): Observable<any> {
    return this.http.post(
      this.host + 'register/patient',
      user,
      this.headers
    );
  }
}
