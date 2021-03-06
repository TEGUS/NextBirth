import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {currentHost} from "../host/host";
import {LocalStorageProvider} from "./localstorage.service";
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {ToastController} from 'ionic-angular';
import { ConseilsPage } from '../pages/conseils/conseils';

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
  
  /**
   * REST COUNTRIES
   */
  getAllCountries() {
    return this.http.get(`https://restcountries.eu/rest/v2/all`, {})
  }
  
  
  
  faitTravail() {
    return new Promise(resolve => {
      this.initHeaders().then(next => {
        this.headers = next;
        resolve()
      });
    })
  }
  
  checkAuthorization() {
    return new Promise(resolve => {
      this.initHeaders().then(next => {
        this.headers = next;
        resolve()
      })
    })
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
   * Toutes les conseils
   * @returns {Observable<any>}
   */
  getConseils(): Observable<any> {
    return this.http.get(
      this.host + 'conseils',
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
   * Send Email
   * @param message
   */
  sendMail(email): Observable<any> {
    return this.http.post(
      `${this.host}contacts`,
      email,
      this.headers
    );
  }
  
  /**
   * Update Event
   * @param event
   */
  updateEvent(event, id): Observable<any> {
    return this.http.put(
      `${this.host}patient/events/${id}`,
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

  /**
   * Mise à jour d'une numéro de téléphone
   * @param object
   */
  updatePhoneNumber(object: any): Observable<any> {
    return this.http.post(
      this.host + 'profile/phone',
      object,
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
  getArticles(pagenumber): Observable<any> {
    return this.http.get(
      this.host + 'articles?page=' +pagenumber,
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
   * Supprimer un bon bon moment
   * @param id
   * @returns {Observable<any>}
   */
  deleteBonMoment(id): Observable<any> {
    return this.http.delete(
      this.host + 'grossesse/notes/' + id,
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

  /**
   * Retourne l'alerte en fonction de l'ID
   * @param id
   */
  getAlertById(id): Observable<any> {
    return this.http.get(
      `${this.host}alert/${id}`,
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
   * Ajouter une traitement(produit) au Pilulier
   * @param treatment
   * @returns {Observable<any>}
   */
  editImage(image): Observable<any> {
    return this.http.post(
      this.host + 'profile/picture/edit',
      image,
      this.headers
    );
  }
  
  
  /**
   * Changer le mot de passe
   * @param object
   */
  changePassword(object): Observable<any> {
    return this.http.put(
      this.host + 'profiles/change-password',
      object,
      this.headers
    );
  }
  
  
  /**
   * Suppression du compte nextbirth
   * @param password
   */
  deleteAccount(password): Observable<any> {
    const object = {
      password: password
    };
    console.log(object);
    return this.http.post(
      this.host + 'profiles/delete',
      object,
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
  allTreatments(page): Observable<any> {
    return this.http.get(
      this.host + `medicaments?page=${page}`,
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
        db.executeSql('INSERT INTO SITUATIONS VALUES(NULL,?,?,?,?)', [situation.date, situation.titre, situation.description, situation.idNotif])
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
      
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        
        db.executeSql('SELECT * FROM SITUATIONS ORDER BY date DESC', [])
          .then(res => {
            let expenses = [];
            for (var i = 0; i < res.rows.length; i++) {
              expenses.push({
                id: res.rows.item(i).id,
                date:  res.rows.item(i).date,
                titre: res.rows.item(i).titre,
                description: res.rows.item(i).description,
                idNotif: res.rows.item(i).idNotif

                
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




  //////////////////////////////////////////////////////////////////


  

  createConseils(conseil: any) {
    
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO CONSEILS VALUES(NULL,?,?,?)', [conseil.date, conseil.titre, conseil.description])
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
  
  
  getAllConseils() {
    return new Promise((resolve) => {
      
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        
        db.executeSql('SELECT * FROM CONSEILS ORDER BY date DESC', [])
          .then(res => {
            let expenses = [];
            for (var i = 0; i < res.rows.length; i++) {
              expenses.push({
                id: res.rows.item(i).id,
                date:  res.rows.item(i).date,
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
  
  
  deletteAllConseils() {
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'nextbirth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM CONSEILS', [])
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
  titre: string,
  description: string,
  idNotif:any
}


export interface IonButtonEnd {
  title?: string,
  icon?: string,
  code: string,
  event?: any
}
