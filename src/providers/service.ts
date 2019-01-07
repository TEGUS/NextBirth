import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {currentHost} from "../host/host";
import {LocalStorageProvider} from "./localstorage";
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {ToastController} from 'ionic-angular';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  private host: any;
  private headers: any;
  
  private _statusNetwork = null;
  get statusNetwork(): any {
    return this._statusNetwork;
  }
  
  set statusNetwork(value: any) {
    this._statusNetwork = value;
  }
  
  constructor(public http: HttpClient, public localStorage: LocalStorageProvider, public toastCtrl: ToastController, private sqlite: SQLite) {
    this.initHeaders().then(next => {
      this.headers = next;
    });
    this.host = currentHost;
  }
  
  
  faitTravail() {
    this.initHeaders().then(next => {
      this.headers = next;
    });
  }
  
  
  initHeaders() {
    return new Promise((resolve, reject) => {
      this.localStorage.getKey('session').then(next => {
        let headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
        if (next !== null) {
          headers['Authorization'] = 'Bearer ' + next.token;
        }
        resolve({
          headers: new HttpHeaders(headers)
        });
      }, error => {
        reject('No session on local storage!');
      })
    });
  }
  
  /**
   * Retourn la DDM
   */
  getDateDernierMenstrues() {
    return new Promise<Date>((resolve, reject) => {
      this.localStorage.getKey('session').then(session => {
        if (session !== null) {
          resolve((new Date((session.user._embedded.patient.debut_dernieres_menstrues).substring(0, 16) + 'Z')));
        } else {
          reject(false);
        }
      })
    })
  }
  
  ///// ** Modes
  
  /**
   * Le mode courant
   * @returns {Observable<any>}
   */
  getMode(): Observable<any> {
    return this.http.get(
      this.host + 'choice-mode',
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
   * All Events
   * @returns {Observable<any>}
   */
  getAllEvents(delai_min, delai_max): Observable<any> {
    const url = `${this.host}evenement-grossesse?delai_jour_min=${delai_min}&delai_jour_max=${delai_max}`;
    console.log(url);
    return this.http.get(url, this.headers);
  }
  
  /**
   * Add Event
   * @param event
   */
  addEvent(event): Observable<any> {
    return this.http.post(
      `${this.host}patient/events`,
      event,
      this.headers
    );
  }
  
  /**
   * Update Event
   * @param event
   */
  updateEvent(event): Observable<any> {
    return this.http.put(
      `${this.host}patient/events/${event.id}`,
      event,
      this.headers
    );
  }
  
  /**
   * Delete Event
   * @param event
   */
  deleteEvent(idEvent): Observable<any> {
    return this.http.delete(
      `${this.host}patient/events/${idEvent}`,
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
      {
        categorie: {
          id: id
        }
      },
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
  
  
  dateprochaineVisite(data: any): Observable<any> {
    return this.http.put(
      this.host + ' grossesse/date-next-visite',
      data,
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
   * Recheche de medicament
   * @returns {Observable<any>}
   */
  getMedicamentByName(name): Observable<any> {
    return this.http.get(
      `${this.host}medicament/search?pattern=${name}`, this.headers
    );
  }
  
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
  
  /**
   * Les différentes alerts d'un treatment
   * @returns {Observable<any>}
   */
  getAlertsTreatment(id): Observable<any> {
    return this.http.get(
      `${this.host}medicaments/${id}/alerts`,
      this.headers
    );
  }
  
  
  /**
   * Marquer la prise des médicaments
   * @returns {Observable<any>}
   */
  takedMedicament(idAlert): Observable<any> {
    return this.http.put(
      `${this.host}medicament/alert/${idAlert}/take`,
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
  
  /**
   * Update Vital Infos
   * @param object
   * @returns {Observable<any>}
   */
  vitalInfo(object): Observable<any> {
    return this.http.patch(
      this.host + 'patient/vital-info',
      object,
      this.headers
    );
  }
  
  
  ///////////////////////////////////////////////////////////////
  
  ///// base de données local ///////////
  
  //////////////////////////////////////////////////////////////
  
  
  createSituations(situation: Situation) {
    
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO SITUATIONS VALUES(NULL,?,?,?)', [situation.date, situation.titre, situation.description])
          .then(res => {
            
            resolve(res);
          })
          .catch(e => {
            // this.presentToast('table pays donst exist!');
            resolve(e);
          });
      }).catch(e => {
        // this.presentToast('database donst exist!');
        resolve(e);
      });
    });
  }
  
  
  getAllSituations() {
    return new Promise((resolve) => {
      this.sqlite.create({name: 'nextbirth.db', location: 'default'}).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM SITUATIONS ORDER BY date DESC', [])
          .then(res => {
            let expenses = [];
            for (var i = 0; i < res.rows.length; i++) {
              expenses.push({
                id: res.rows.item(i).id,
                date: res.rows.item(i).date,
                titre: res.rows.item(i).titre,
                description: res.rows.item(i).description
              })
            }
            resolve(expenses);
          })
          .catch(e => {
            console.log(e);
            resolve(0);
          });
      }).catch(e => {
        // this.presentToast('database donst exist!');
        console.error(e)
      });
    });
  }
  
  
  deletteAllSituations() {
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM SITUATIONS', [])
          .then(res => {
            resolve(1);
          })
          .catch(e => {
            console.log(e);
            resolve(0);
          });
      }).catch(e => {
        this.presentToast('database donst exist!');
      });
    });
  }

////////////////////////////////////////////////////////////////////////
  
  
  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
}

export interface Situation {
  date: Date,
  titre: string;
  description: string
}


export interface IonButtonEnd {
  title?: string,
  icon?: string,
  code: string
}
