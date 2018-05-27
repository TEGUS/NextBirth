import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";
import { Session } from '../../configs/configs';
import { LocalstorageProvider } from '../../providers/localstorage';

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider ,
     public loadingCtrl: LoadingController,
     public toastCtrl: ToastController, public mylocalstorage: LocalstorageProvider) {

      this.getAllcategories();


  }

  ionViewWillLoad() {
    this.getAllcategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseModePage');
  }

  selectmode(onemodeid){
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.selectMode(onemodeid).subscribe(resp => {

          this.mylocalstorage.storeModeInSession(resp._embedded.categorie).then(()=>{

          });

      }, error => {
        loading.dismiss();

      }, () => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.presentToast('succes du stochage du mode!');
        });
      });

  }


  getAllcategories(){
        let loading = this.loadingCtrl.create();
        loading.present();
        this.services.getCategories().subscribe(next => {
          this.modes = next;

        }, error => {
          loading.dismiss();

        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.presentToast('succes de la recupération des modes!');
          });
        });
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }

}
