import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/metier.service';
import moment from 'moment';
import {showDateAndTime_2} from "../../variables/functions";

/**
 * Generated class for the ConseilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conseils',
  templateUrl: 'conseils.html',
})
export class ConseilsPage {

  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public services: ServiceProvider) {
    moment.locale('fr');
  }

  ionViewDidLoad() {
    

    this.services.getAllConseils().then((result: Array<any>) =>{
      this.items = [];
      result.forEach(item => {
        this.items.push({
          ...item,
          date: showDateAndTime_2(item.date)
        });
      });
    });

    
  }

}
