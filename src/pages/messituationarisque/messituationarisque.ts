import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/metier.service';
import moment from 'moment';

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
  public testeur = 0;
  public titre: any;
  public description: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public services: ServiceProvider) {
    moment.locale('fr');
  }

  ionViewDidLoad() {
    this.services.getAllSituations().then((result:any) =>{
      this.items = result;
    });
  }

  parseDate(date, format) {
    var ladate = date.substring(0,16)+'Z'
    return moment(new Date(ladate)).format(format);
  }

  selectArticle(titre, description){
    this.testeur = 1;
    this.titre = titre;
    this.description = description;
  }

  revientsituation(){
    this.testeur = 0;
  }

}
