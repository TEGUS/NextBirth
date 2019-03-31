import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FluxReglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flux-regle',
  templateUrl: 'flux-regle.html',
})
export class FluxReglePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FluxReglePage');
  }

  img1j1(){
      // alert("le pros");
  }

  submit(){
    // alert("le mokai");
  }

}
