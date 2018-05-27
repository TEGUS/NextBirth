import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";
import {LocalStorageProvider} from '../../providers/localstorage';

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public mylocalstorage: LocalStorageProvider) {
  }

  ionViewWillLoad() {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseModePage');
    this.getAllcategories();
  }

  selectMode(id_mode) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.selectMode(id_mode).subscribe(resp => {
      this.mylocalstorage.storeModeInSession(resp._embedded.categorie).then(next => {
        console.log(next);
      });
    }, error => {
      loading.dismiss();
    }, () => {
      loading.dismiss();
      loading.onDidDismiss(() => {
        console.log('Succes du stochage du mode!');
      });
    });

  }


  getAllcategories() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getCategories().subscribe(next => {
      this.modes = next;
    }, error => {
      loading.dismiss();

    }, () => {
      loading.dismiss();
      loading.onDidDismiss(() => {
        console.log('succes de la recupération des modes!');
      });
    });
  }
}
