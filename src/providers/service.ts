import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {currentHost} from "../host/host";
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
        let o = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        if (next !== null) {
          o['Authorization'] = 'Bearer ' + next.token;
        }
        console.log(o);
        resolve({
          headers: new HttpHeaders(o)
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

  updateprofile(utilisateurs: any): Observable<any> {
    return this.http.put(
      this.host + 'patient/profile/complete',
      utilisateurs,
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
      this.host + 'patient/profile/check',
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

  /**
   * Vérification des informations nécessaires pour la mode désir de grossesse
   * @returns {Observable<any>}
   */
  checkProfileDesirGrossesse(): Observable<any> {
    return this.http.get(
      this.host + 'patient/profile/desir-grossesse/check',
      this.headers
    );
  }

  /**
   * Retourne les articles portant sur le mode choisi
   * @returns {Observable<any>}
   */
  getArticles(): Observable<any> {
    return this.http.get(
      this.host + 'articles',
      this.headers
    );
  }


  /**
   * Retourne les détails sur un article
   * @returns {Observable<any>}
   */
  getArticle(id): Observable<any> {
    return this.http.get(
      this.host + 'article/' + id,
      this.headers
    );
  }


  ////--- PILULIER

  /**
   * Ajouter une traitement(produit) au Pilulier
   * @param treatment
   * @returns {Observable<any>}
   */
  addTreatment(treatment): Observable<any> {
    return this.http.post(
      this.host + 'medicaments',
      treatment,
      this.headers
    );
  }

  /**
   * Mise à jour d'un traitement
   * @param treatment
   * @returns {Observable<any>}
   */
  updateTreatment(id, treatment): Observable<any> {
    return this.http.put(
      this.host + 'medicament/' + id,
      treatment,
      this.headers
    );
  }

  /**
   * Supprimer un traitement
   * @param id
   * @returns {Observable<any>}
   */
  deleteTreatment(id): Observable<any> {
    return this.http.delete(
      this.host + 'medicaments/' + id,
      this.headers
    );
  }

  /**
   * Les différentes fréquences de prise de traitement
   * @returns {Observable<any>}
   */
  getFrequencesPrise(): Observable<any> {
    return this.http.get(
      this.host + 'medicament/config',
      this.headers
    );
  }




  //////////////////////////////


   /**
   * Ajouter une traitement(produit) au Pilulier
   * @param treatment
   * @returns {Observable<any>}
   */
  saveNote(note): Observable<any> {
    return this.http.post(
      this.host + 'grossesse/notes',
      note,
      this.headers
    );
  }

  /**
   * Les différentes fréquences de prise de traitement
   * @returns {Observable<any>}
   */
  getAllNote(): Observable<any> {
    return this.http.get(
      this.host + 'grossesse/notes',
      this.headers
    );
  }


  
  /**
   * Get all treatments
   * @returns {Observable<any>}
   */
  allTreatments(): Observable<any> {
    return this.http.get(
      this.host + 'medicaments',
      this.headers
    );
  }
}
