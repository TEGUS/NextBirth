import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PilulierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pilulier',
  templateUrl: 'pilulier.html',
})
export class PilulierPage {
  public testeur: any;
  public date: any;
  public monthNames: string[];
  public currentDate: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.testeur = 0;
    console.log('ionViewDidLoad PilulierPage');
  }

  changetesteur1(){
    this.testeur = 0;
  }

  changetesteur2(){
    this.testeur = 1;
  }
}
