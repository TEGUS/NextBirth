import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {ServiceProvider} from "../../providers/metier.service";
import {LocalStorageProvider} from '../../providers/localstorage.service';
import {QuestionContraceptionPage} from "../question-contraception/question-contraception";
import {ModeContraceptionPage} from "../mode-contraception/mode-contraception";
import {ReportPage} from "../report/report";
import {LocalNotifications} from '@ionic-native/local-notifications';
import * as codesMode from "../../components/mode/mode";

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];
  public testeur = 0;
  public testeurovulation = 0;
  public nombrejrretard = 0;
  public nombrejourseignement = 0;
  public nombrejrovulation = 0;
  public dateovulation = 0;
  public datesegnement = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public toastCtrl: ToastController, public localStorage: LocalStorageProvider, private localNotifications: LocalNotifications) {
  }

  ionViewWillLoad() {
    this.services.initHeaders();
  }

  ionViewDidLoad() {
    this.getAllcategories();
    this.localStorage.getSession().then((result: any) => {
      
          var debut_dernieres_menstrues = result.user._embedded.patient.debut_dernieres_menstrues;
          var duree_cycle = result.user._embedded.patient.duree_menstrues;

          var ladate = debut_dernieres_menstrues.substring(0, 16) + 'Z';
          var premieredate = new Date(ladate).getTime();
          var dateaujourdui = new Date().getTime();
          var nombremilliseconde = dateaujourdui - premieredate;
          var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
        
          if(nombresjours>duree_cycle){
              this.testeur = 1;
              this.nombrejrretard = nombresjours - duree_cycle;
          }

          // determination du jour d'ovulation

          var deseignements:any;
          var dateovulation:any;
          

          var datedans30jours = new Date(premieredate + duree_cycle * 24 * 60 * 60 * 1000);
          deseignements = datedans30jours.toLocaleDateString("fr");

          this.datesegnement = deseignements;

          var datedans14jours = new Date(premieredate + (duree_cycle-14) * 24 * 60 * 60 * 1000);
          dateovulation = datedans14jours.toLocaleDateString("fr");

          this.dateovulation = dateovulation;

          
          deseignements = deseignements.substring(6,10) + '-' + deseignements.substring(3,5) + '-' + deseignements.substring(0,2) + "T19:46Z";
          dateovulation = dateovulation.substring(6,10) + '-' + dateovulation.substring(3,5) + '-' + dateovulation.substring(0,2) + "T19:46Z";

          var premieredate2 = new Date(dateovulation).getTime();
          var dateaujourdui2 = new Date().getTime();
          var nombremilliseconde2 = premieredate2 -dateaujourdui2;
          var nombresjours2 = Math.ceil(((((nombremilliseconde2 / 1000) / 60) / 60) / 24));
         
          if((nombresjours2>0)&&(this.testeur!=1)){

            this.testeur = 2;
            this.nombrejrovulation = nombresjours2;

          }else if(this.testeur!=1){

            this.testeur = 3;
            var premieredate3 = new Date(deseignements).getTime();
            var dateaujourdui3 = new Date().getTime();
            var nombremilliseconde3 = premieredate3 - dateaujourdui3;
            var nombresjours3 = Math.ceil(((((nombremilliseconde3 / 1000) / 60) / 60) / 24));
            this.nombrejourseignement = nombresjours3;
            if(this.nombrejourseignement<=3){
                this.testeurovulation = 1;
            }

          }
    }, error => {
      console.error(error)
    });
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
          let listesNotification = [];
          var i = 0;
          alerts.forEach((element) => {
            let manotification = {
              id: i + 1,
              text: element._embedded.conseil.description,
              //trigger: {at: new Date(new Date().getTime() + (60*1000)*(i+1))},
              trigger: {at: new Date((new Date(element.date_alert)).getTime())},
              led: 'FF0000',
              sound: 'file://assets/imgs/notification.mp3'
            }

            listesNotification.push(manotification);
            i++;
          });

          if (i == alerts.length) {
            this.localNotifications.schedule(
              listesNotification
            );
          }
          this.localStorage.storeModeInSession(mode);
        }, error => {
          loading.dismiss();
          console.error(error);
        }, () => {
          console.log('Succes du stochage du mode!');
          //Redirection vers la page du Mode
          switch (mode.code) {
            case codesMode.CONTPL:
              loading.dismiss();
              this.navCtrl.push("ModeContraceptionPage", {
                title: mode.intitule
              })
              break;
            case codesMode.CONTPR:
              loading.dismiss();
              this.navCtrl.push("ModeContraceptionPage", {
                title: mode.intitule
              })
              break;
            case codesMode.GRS:
              this.checkProfileDesirGrossesse().then((next: any) => {
                loading.dismiss()
                if (next.status) {
                  let alert = this.alertCtrl.create({
                    message: 'Voulez vous mettre à jour vos infos ?',
                    buttons: [
                      {
                        text: 'Non',
                        handler: () => {
                          this.navCtrl.push("ReportPage")
                        }
                      },
                      {
                        text: 'Oui',
                        handler: () => {
                          this.navCtrl.push("QuestionContraceptionPage", {
                            infos_desir_grossesse: next.infos_desir_grossesse
                          })
                        }
                      }
                    ]
                  });
                  alert.present();
                } else {
                  this.navCtrl.push("QuestionContraceptionPage")
                }
              }, error => {
                console.error(error)
                loading.dismiss();
              })
              break;
            case codesMode.GEST:
              loading.dismiss();
              this.navCtrl.push("ReportPage")
              break;
          }
        });
      } else {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.localStorage.setKey("modeSelected", mode);
          //Redirection vers Update Profile
          this.navCtrl.push("UpdateProfilePage");
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



