import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SurveillancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-surveillance',
  templateUrl: 'surveillance.html',
})
export class SurveillancePage {

  public testeur = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.testeur = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveillancePage');
  }
  

  actionSurOui(){

     this.testeur = 1;

  }



}
