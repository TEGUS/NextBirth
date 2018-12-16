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

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
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

  updatePatientStorage(patient) {
    this.getKey(this.key).then(session => {
      console.log("===================================");
      console.log(session);
      console.log("===================================");
      session.user._embedded.patient = patient;
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

  

  getSession() {
    return new Promise((resolve, failed) => {
      this.storage.get(this.key).then((data) => {
        if (data == null) {
          failed();
        }else {
          Session.user = data;
          Session.token = data.token;
          resolve(data);
        }
      }).catch((error) => {
        failed();
      });
    });
  }


  storeKeydpv(data) {
    return this.storage.set(this.keydpv, data);
  }


  getKeydpv() {
    return new Promise((resolve, failed) => {
      this.storage.get(this.keydpv).then((data) => {
        if (data == null) {
          failed();
        }else {
          resolve(data);
        }
      }).catch((error) => {
        failed();
      });
    });
  }


  storeKeydpvacc(data) {
    return this.storage.set(this.keydpvacc, data);
  }


  getKeydpvacc() {
    return new Promise((resolve, failed) => {
      this.storage.get(this.keydpvacc).then((data) => {
        if (data == null) {
          failed();
        }else {
          resolve(data);
        }
      }).catch((error) => {
        failed();
      });
    });
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
