import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";
import {LocalStorageProvider} from '../../providers/localstorage';
import {ProfilPage} from "../profil/profil";
import {QuestionContraceptionPage} from "../question-contraception/question-contraception";

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public localStorage: LocalStorageProvider) {
  }

  ionViewWillLoad() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseModePage');
    this.getAllcategories();
  }

  checkProfile() {
    return new Promise((resolve, reject) => {
      this.services.checkProfile().subscribe(next => {
        resolve(next.status);
      }, error => {
        reject(error);
      })
    });
  }

  selectMode(mode) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.checkProfile().then(next => {
      console.log(next);
      if (next) {
        this.services.selectMode(mode.id).subscribe(resp => {
          console.log(resp);
          this.localStorage.storeModeInSession(resp._embedded.categorie);
        }, error => {
          loading.dismiss();
          console.log(error);
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            console.log('Succes du stochage du mode!');
            //Redirection vers la page du Mode
            switch (mode.code) {
              case 'CONTPL':
                break;
              case 'CONTPR':
                break;
              case 'GRS':
                this.navCtrl.push(QuestionContraceptionPage)
                break;
              case 'GEST':
                break;
            }
          });
        });
      } else {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.localStorage.setKey("modeSelected", mode);
          //Redirection vers Update Profile
          this.navCtrl.push(ProfilPage)
        });
      }
    }, error => {
      loading.dismiss();
      console.error(error);
    });
  }

  getAllcategories() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getCategories().subscribe(next => {
      console.log(next);
      this.modes = next;
    }, error => {
      loading.dismiss();
      console.log(error);
    }, () => {
      loading.dismiss();
      loading.onDidDismiss(() => {
        console.log('succes de la recupération des modes!');
      });
    });
  }
}
