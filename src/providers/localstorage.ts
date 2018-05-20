import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Session} from './../configs/configs';
import {HttpClient} from "@angular/common/http";

/*
  Generated class for the LocalstorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalstorageProvider {

  private key = 'session';

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello LocalstorageProvider Provider');
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
        } else {
          Session.user = data;
          Session.token = data.token;
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
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
  }

}
