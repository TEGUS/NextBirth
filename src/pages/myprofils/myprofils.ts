import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/localstorage';
import {IonButtonEnd} from "../../providers/service";

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
  public imageaafficher = "";
  
  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider,
              public navParams: NavParams) {
  }
  
  ionViewWillEnter() {
    this.localStorage.getKey('session').then(next => {
      this.user = next.user;
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
    return new Date(('' + date).substring(0,16)+'Z');
  }
}
