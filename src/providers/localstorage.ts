import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the LocalstorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalstorageProvider {

  // storage = new Storage({
  //   name: '__nextbirth_db',
  //   driverOrder: ['indexeddb', 'sqlite', 'websql']
  // });

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello LocalstorageProvider Provider');
  }

  //store key
  setKey(key, value) {
    return this.storage.set(key, value);
  }

  //get the stored key
  getKey(key) {
    return this.storage.get(key);
  }

  //delete the key
  removeKey(key) {
    return this.storage.remove(key);
  }

  //clear the whole local storage
  clearStorage() {
    this.storage.clear();
  }

}
