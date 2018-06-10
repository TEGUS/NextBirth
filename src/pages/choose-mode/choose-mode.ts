import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";
import {LocalStorageProvider} from '../../providers/localstorage';
import {ProfilPage} from "../profil/profil";
import {QuestionContraceptionPage} from "../question-contraception/question-contraception";
import {ModeContraceptionPage} from "../mode-contraception/mode-contraception";
import {Img8Page} from "../img8/img8";
import {ReportPage} from "../report/report";
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public toastCtrl: ToastController, public localStorage: LocalStorageProvider,private localNotifications: LocalNotifications) {
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
        console.log(next)
        resolve(next.status);
      }, error => {
        reject(error);
      })
    });
  }

  checkProfileDesirGrossesse() {
    return new Promise((resolve, reject) => {
      this.services.checkProfileDesirGrossesse().subscribe(next => {
        console.log(next)
        resolve(next);
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
        this.services.selectMode(mode.id).subscribe(alerts => {
         
          alerts.forEach(element => {
            /*console.log("=======================================");
            console.log(new Date().getTime());
            console.log(new Date(element.date_alert).getTime());
            console.log(element.date_alert);
            console.log(element._embedded.conseil.description);
            console.log("=======================================");*/
            this.localNotifications.schedule({
              text: element._embedded.conseil.description,
              trigger: {at: new Date(new Date(element.date_alert).getTime())},
              led: 'FF0000',
              sound: 'file://assets/imgs/notification.mp3'
            });
            
          });

          
          
          this.localStorage.storeModeInSession(mode);
        
        
        }, error => {
          loading.dismiss();
          console.error(error);
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            console.log('Succes du stochage du mode!');
            //Redirection vers la page du Mode
            switch (mode.code) {
              case 'CONTPL':
                this.navCtrl.push(ModeContraceptionPage, {
                  title: mode.intitule
                })
                break;
              case 'CONTPR':
                this.navCtrl.push(ModeContraceptionPage, {
                  title: mode.intitule
                })
                break;
              case 'GRS':
                let loading = this.loadingCtrl.create();
                loading.present();
                this.checkProfileDesirGrossesse().then((next: any) => {
                  loading.dismiss()
                  if (next.status) {
                    let alert = this.alertCtrl.create({
                      message: 'Voulez vous mettre à jour vos infos ?',
                      buttons: [
                        {
                          text: 'Non',
                          handler: () => {
                            this.navCtrl.push(ReportPage)
                          }
                        },
                        {
                          text: 'Oui',
                          handler: () => {
                            this.navCtrl.push(QuestionContraceptionPage, {
                              infos_desir_grossesse: next.infos_desir_grossesse
                            })
                          }
                        }
                      ]
                    });
                    alert.present();
                  } else {
                    this.navCtrl.push(QuestionContraceptionPage)
                  }
                }, error => {
                  console.error(error)
                  loading.dismiss();
                })
                break;
              case 'GEST':
                this.navCtrl.push(Img8Page)
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
