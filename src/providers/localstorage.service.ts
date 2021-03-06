import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Session} from './../configs/configs';
import {HttpClient} from "@angular/common/http";

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {
  private key = 'session';
  private keymode = 'mode';
  private keydpv = 'keydpv';
  private keydpvacc = 'keydpvacc';
  private testeurntif = 'testeurnotif';
  private risque = 'lemokai'
  private valideconseil = 'valideconseil'

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
  }
  
  /**
   * Store Default Language
   * @param object
   */
  setDefaultLang(object: string) {
    return new Promise<string>(resolve => {
      this.setKey('defaultLang', object);
      resolve(object)
    })
  }
  
  /**
   * Get Default Language
   */
  getDefaultLang() {
    return new Promise<string>(resolve => {
      this.getKey('defaultLang').then(val => {
        resolve(val);
      })
    })
  }
  
  setObjectUpdateProfile(object) {
    this.setKey('objectUpdateProfile', object);
  }
  
  getObjectUpdateProfile() {
    return new Promise(resolve => {
      this.getKey('objectUpdateProfile').then(val => {
        resolve(val);
      })
    })
  }

  storeModeInSession(mode) {
    Session.mode = mode;
    return new Promise((resolve) => {
      this.storage.set(this.keymode, mode).then((val) => {
        resolve();
      }, error => {
        resolve();
      });
    });
  }
  
  /**
   * Get Mode
   */
  getMode() {
    return new Promise<string>(resolve => {
      this.getKey(this.keymode).then(val => {
        resolve(val);
      })
    })
  }


  storeValideconseilInSession(mode) {
    Session.mode = mode;
    return new Promise((resolve) => {
      this.storage.set(this.valideconseil, mode).then((val) => {
        resolve();
      }, error => {
        resolve();
      });
    });
  }
  
  /**
   * Get Mode
   */
  getValideconseil() {
    return new Promise<string>(resolve => {
      this.getKey(this.valideconseil).then(val => {
        resolve(val);
      })
    })
  }






  updatePatientStorage(patient) {
    this.getKey(this.key).then(session => {
      console.log("===================================");
      console.log(patient);
      console.log(session);
      console.log("===================================");
      // session.user._embedded.patient = patient;
      session.user = patient;
      this.setKey(this.key, session);
    });
  }


  getModeInSession() {
    return new Promise((resolve, failed) => {
      this.storage.get(this.keymode).then((data) => {
        if (data == null) {
          failed();
        } else {
          Session.mode = data;
        }
      }).catch((error) => {
        failed();
      });
    });
  }

  storeSession(data) {
    console.log(data);
    Session.user = data;
    Session.token = data.token;
    return this.storage.set(this.key, data);
  }

  storeTesteur(data) {
    return this.storage.set(this.testeurntif, data);
  }

  storeRisque(data) {
    return this.storage.set(this.risque, data);
  }


  

  getRisque() {
    return new Promise<any>((resolve, failed) => {
      this.storage.get(this.risque).then((data) => {
        if (data == null) {
          failed(null);
        }else {
          resolve(data);
        }
      }).catch((error) => {
        failed(error);
      });
    });
  }


  getTesteur() {
    return new Promise<any>((resolve, failed) => {
      this.storage.get(this.testeurntif).then((data) => {
        if (data == null) {
          resolve(0);
        }else {
          resolve(data);
        }
      }).catch((error) => {
        alert("impossible");
        failed(error);
      });
    });
  }
  

  getSession() {
    return new Promise<any>((resolve, failed) => {
      this.storage.get(this.key).then((data) => {
        if (data == null) {
          failed(null);
        }else {
          Session.user = data;
          Session.token = data.token;
          resolve(data);
        }
      }).catch((error) => {
        failed(error);
      });
    });
  }


  storeKeydpv(data) {
    return this.storage.set(this.keydpv, data);
  }


  getKeydpv() {
    return new Promise<any>((resolve, failed) => {
      this.storage.get(this.keydpv).then((data) => {
        if (data == null) {
          failed(null);
        }else {
          resolve(data);
        }
      }).catch((error) => {
        failed(error);
      });
    });
  }


  storeKeydpvacc(data) {
    return this.storage.set(this.keydpvacc, data);
  }


  getKeydpvacc() {
    return new Promise<any>((resolve, failed) => {
      this.storage.get(this.keydpvacc).then((data) => {
        if (data == null) {
          failed(null);
        }else {
          resolve(data);
        }
      }).catch((error) => {
        failed(error);
      });
    });
  }
  
  /**
   * Store Countries
   * @param countries
   */
  setCountries(countries) {
    return new Promise(resolve => {
      this.setKey('countries', countries);
      resolve()
    })
  }
  
  /**
   * Get Countries
   */
  getCountries() {
    return new Promise<Array<any>>(resolve => {
      this.getKey('countries').then(val => {
        resolve(val);
      })
    })
  }

  //store key
  setKey(key, value) {
    return this.storage.set(key, value);
  }

  //get the stored key
  getKey(key) {
    return this.storage.get(key);
  }

  //delete key
  removeKey(key) {
    return this.storage.remove(key);
  }

  //clear the whole local storage
  clearStorage() {
    return this.storage.clear();
  }
}
