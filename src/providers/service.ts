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

  /**
   * Le mode courant
   * @returns {Observable<any>}
   */
  getMode(): Observable<any> {
    return this.http.get(
      this.host + 'choice-modes',
      this.headers
    );
  }

  /**
   * Toutes les catégories
   * @returns {Observable<any>}
   */
  getCategories(): Observable<any> {
    return this.http.get(
      this.host + 'categories',
      this.headers
    );
  }

  /**
   * Selection d'un mode
   * @param id
   * @returns {Observable<any>}
   */
  selectMode(id): Observable<any> {
    return this.http.post(
      this.host + 'choice-modes',
      {categorie: id},
      this.headers
    );
  }

  ///// ** Profile

  /**
   * Check Profile
   * @returns {Observable<any>}
   */
  checkProfile(): Observable<any> {
    return this.http.get(
      this.host + 'patient/profil/check',
      this.headers
    );
  }

  /**
   * Get Configs Désir de grossesse
   * @returns {Observable<any>}
   */
  getConfigDesirGrossesse(): Observable<any> {
    return this.http.get(
      this.host + 'patient/desir-grossesse/complete/config',
      this.headers
    );
  }

  /**
   * Complete Desir Grossesse
   * @param object
   * @returns {Observable<any>}
   */
  completeDesirGrossesse(object): Observable<any> {
    return this.http.put(
      this.host + 'patient/desir-grossesse/complete',
      object,
      this.headers
    );
  }
}
