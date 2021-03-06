import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MyApp} from "../../app/app.component";

/**
 * Generated class for the ErrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {
  message = 'Vérifier votre connection internet';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navParams.get('message');
  }

  
  reload() {
    this.navCtrl.setRoot(MyApp);
  }
}
