import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {currentHost} from "../host/host";
import {Observable} from "rxjs/Observable";
import {LocalStorageProvider} from "./localstorage";

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  host: any;
  headers: any;

  constructor(public http: HttpClient, public localStorage: LocalStorageProvider) {
    this.initHeaders().then(next => {
      this.headers = next;
    });
    this.host = currentHost;
  }

  initHeaders() {
    return new Promise((resolve, reject) => {
      this.localStorage.getKey('session').then(next => {
        resolve({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + next.token
          })
        });
      }, error => {
        reject('No session on local storage!');
      })
    });
  }

  ///// ** Modes
  getModes(): Observable<any> {
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

  selectMode(id): Observable<any> {
    return this.http.post(
      this.host + 'choice-modes',
      {categorie: id},
      this.headers
    );
  }

  updateprofile(utilisateurs: any): Observable<any> {
    return this.http.put(
      this.host + 'patient/profile/complete',
      utilisateurs,
      this.headers
    );
  }

  ///// ** Profile
  checkProfile(): Observable<any> {
    return this.http.get(
      this.host + 'patient/profil/check',
      this.headers
    );
  }
}
