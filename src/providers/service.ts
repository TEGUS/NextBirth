import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {currentHost} from "../host/host";
import {Observable} from "rxjs/Observable";
import { Session } from '../configs/configs';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  host: any;
  token: any;
  headers: any;

  constructor(public http: HttpClient) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + Session.token
      })
    };
    this.host = currentHost;
  }

  getChoiceModes(): Observable<any> {
    return this.http.get(
      this.host + 'choice-modes',
      this.headers
    );
  }



  getCategories(): Observable<any> {
    return this.http.get(
      this.host + 'categories',
      this.headers
    );
  }

  selectonemode(id): Observable<any>{
    return this.http.post(
      this.host + 'choice-modes',
      {categorie:id},
      this.headers
    );
  }

}
