import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LocalStorageProvider} from '../../../providers/localstorage';
import {IonButtonEnd} from "../../../providers/service";
import {formatDate} from "../../../variables/functions";

/**
 * Generated class for the MyprofilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myprofils',
  templateUrl: 'myprofils.html',
})
export class MyprofilsPage {
  ionButtonsEnd: Array<IonButtonEnd> = [];
  user = null;
  patient = null;
  imageaafficher = null;
  
  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider,
              public navParams: NavParams) {
  }
  
  ionViewWillEnter() {
    this.localStorage.getKey('session').then(next => {
      if (next !== undefined && next !== null) {
        this.patient = next.user._embedded.patient;
        
        if (this.patient._embedded.hasOwnProperty('account')) {
          this.user = this.patient._embedded.account;
        } else {
          this.user = next.user
        }
  
        if (this.user._embedded.photo !== undefined && this.user._embedded.photo !== null) {
          let photo = this.user._embedded.photo;
          this.imageaafficher = photo._embedded.url_photo
        }
      }
    }, error => {
      console.error(error);
    });
  }
  
  ionViewDidLoad() {
    this.ionButtonsEnd.push({
      icon: 'create',
      code: 'update',
      title: 'Mise à jour'
    })
  }
  
  getClickedButton(button: IonButtonEnd) {
    switch (button.code) {
      case 'update':
        this.navCtrl.push('ProfilPage');
        break;
    }
  }
  
  formatBool(bool: boolean) {
    return bool ? 'Oui' : 'Non';
  }
  
  formatDate(date: string) {
    let d = null;
    if (date !== null) {
      d =  new Date(('' + date).substring(0,16)+'Z')
    }
    return d;
  }
}
