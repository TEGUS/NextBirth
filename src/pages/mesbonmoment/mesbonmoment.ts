import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service';
import moment from 'moment';


/**
 * Generated class for the MesbonmomentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mesbonmoment',
  templateUrl: 'mesbonmoment.html',
})
export class MesbonmomentPage {
  public items = [];
  public testeur = 0;
  public libelle: any;
  public description: any;
  public images: any;



  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public services: ServiceProvider,
              public navParams: NavParams, private view: ViewController) {
    this.services.initHeaders();

    moment.locale('fr');
  }

  ionViewDidLoad() {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.getAllNote().subscribe(next => {
          this.items = next;
          console.log("==============================");
          console.log(next);
          console.log("==============================");
      }, error => {
        loading.dismiss();
        console.error(error);
      }, () => {
        loading.dismiss();
      });
  }

  selectNode(id, libelle, description, images){
    this.testeur = 1;

    this.libelle = libelle;
    this.description = description;
    this.images = images;
  }


  parseDate(date, format) {
    var ladate = date.substring(0,16)+'Z'
    return moment(new Date(ladate)).format(format);
  }

}
