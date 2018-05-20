import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Session} from './../configs/configs';

/*
  Generated class for the LocalstorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalstorageProvider {

  private key = 'session';
  private keymode = 'mode';
  

  constructor(public storage: Storage){
      
  }

  storeModeInSession(mode){
     Session.mode = mode;
     return new Promise((resolve)=>{
      this.storage.set(this.keymode, mode).then((val) => {
        resolve();
      }, error=>{
          resolve();
      });
  });
  }

  getModeInSession(){
    return new Promise((resolve,  failed)=>{
        this.storage.get(this.keymode).then((data) => {
            if(data == null){
                failed();
            }else{
                Session.mode = data;
            }
        }).catch((error)=>{
            failed();
        });
    });
}

  storeSession(data){
     
      Session.user = data;
      Session.token = data.token;
      return new Promise((resolve)=>{
          this.storage.set(this.key, data).then((val) => {
            resolve();
          }, error=>{
              resolve();
          });
      });
  }


  getSession(){
      return new Promise((resolve,  failed)=>{
          this.storage.get(this.key).then((data) => {
              if(data == null){
                  failed();
              }else{
                  Session.user = data;
                  Session.token = data.token;
                  resolve(data);
              }
          }).catch((error)=>{
              failed();
          });
      });
  }



}
