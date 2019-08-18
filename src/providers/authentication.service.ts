import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {currentHost} from "../host/host";
import {Headers} from "@angular/http";
import {Observable} from "rxjs";

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
      this.initHeaders(user.phone, user.plainPassword)
    );
  }

  signUp(user: any): Observable<any> {
    return this.http.post(
      this.host + 'register/patient',
      user,
      this.headers
    );
  }

  confirmRegisterCode(confirmCode): Observable<any> {
    return this.http.post(
      this.host + 'register/confirm',
      confirmCode,
      this.headers
    );
  }

  resettingRequestCode(params): Observable<any> {
    return this.http.post(
      this.host + 'resetting/request',
      params,
      this.headers
    );
  }

  resetPassword(params): Observable<any> {
    return this.http.post(
      this.host + 'resetting/reset',
      params,
      this.headers
    );
  }
}
