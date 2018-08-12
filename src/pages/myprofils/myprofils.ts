import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/localstorage';

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

  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.localStorage.getKey('session').then(next => {
        console.log("======================================");
        console.log(next.patient);
        console.log("======================================");
    }, error => {
      console.log(error);
    });
  }

}
