import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service';

/**
 * Generated class for the MessituationarisquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messituationarisque',
  templateUrl: 'messituationarisque.html',
})
export class MessituationarisquePage {

  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public services: ServiceProvider) {
  }

  ionViewDidLoad() {
    this.services.getAllSituations().then((result:any) =>{
        this.items = result;
    });
  }

}
