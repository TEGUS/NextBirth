import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {ServiceProvider} from "../../providers/metier.service";
import {LocalStorageProvider} from '../../providers/localstorage.service';
import {QuestionContraceptionPage} from "../question-contraception/question-contraception";
import {ModeContraceptionPage} from "../mode-contraception/mode-contraception";
import {ReportPage} from "../report/report";
import {LocalNotifications} from '@ionic-native/local-notifications';
import * as codesMode from "../../components/mode/mode";
import {DatePicker} from '@ionic-native/date-picker';

@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];
  public testeur = 0;
  public testeurovulation = 0;
  public testeurovulation1 = 0;
  public nombrejrretard = 0;
  public nombrejourseignement = 0;
  public nombrejourseignement1 = 0;
  public nombrejourseignement2 = 0;
  public nombrejrovulation = 0;
  public nombrejrovulation1 = 0;
  public nombrejrovulation2 = 0;
  public dateovulation = 0;
  public datesegnement = 0;
  public datesegnement1 = 0;
  public datesegnement2 = 0;

  public dateovulation1 = 0;
  public dateovulation2 = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: ServiceProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public toastCtrl: ToastController, public mylocalstorage: LocalStorageProvider, private datePicker: DatePicker,
              public localStorage: LocalStorageProvider, private localNotifications: LocalNotifications) {
  }

  ionViewWillLoad() {
    //this.services.initHeaders();
  }

  ionViewDidLoad() {
    this.getAllcategories();
    this.localStorage.getSession().then((result: any) => {
      
          var debut_dernieres_menstrues = result.user._embedded.patient.debut_dernieres_menstrues;
         
          //duree_cycle_max
          var duree_cycle = result.user._embedded.patient.duree_cycle_max;
          var duree_cycle_max = result.user._embedded.patient.duree_cycle_max;
          var duree_cycle_min = result.user._embedded.patient.duree_cycle_min;

          var ladate = debut_dernieres_menstrues.substring(0, 16) + 'Z';
          var premieredate = new Date(ladate).getTime();
          var dateaujourdui = new Date().getTime();
          var nombremilliseconde = dateaujourdui - premieredate;
          var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
        
          // on veux savoir si la durée qui separe la date de denier règle a ajourd'hui es suppérieur a la durée du ycle.

          if(nombresjours>duree_cycle){
              this.testeur = 1;
              this.nombrejrretard = nombresjours - duree_cycle;
          }

          // determination du jour d'ovulation

          
          
          

          if(duree_cycle_max == duree_cycle_min){

                    var deseignements:any;
                    var dateovulation:any;
                    var datedans30jours = new Date(premieredate + duree_cycle * 24 * 60 * 60 * 1000);
                    deseignements = datedans30jours.toLocaleDateString("fr");
                    this.datesegnement = deseignements;
                    var datedans14jours = new Date(premieredate + (duree_cycle-14) * 24 * 60 * 60 * 1000);
                    dateovulation = datedans14jours.toLocaleDateString("fr");

                    // pour avoir la date d'ovulation
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
                          this.datepdeseignement()
                      }

                    }else if((nombresjours2<0) && (nombresjours2 ==-1)){
                      this.testeur = 4;
                    }else if((nombresjours2<0) && (nombresjours2 ==-2)){
                      this.testeur = 5;
                    }


          }else{

                // nous allons determiner l'interval probable d'ovulation.

                   // pour la première dure du cycle


                    var deseignements1:any;
                    var dateovulation1:any;
                    var deseignements2:any;
                    var dateovulation2:any;

                    var datedans30jours1 = new Date(premieredate + duree_cycle_max * 24 * 60 * 60 * 1000);
                    deseignements1 = datedans30jours1.toLocaleDateString("fr");
                    this.datesegnement1 = deseignements1;
                    var datedans14jours1 = new Date(premieredate + (duree_cycle_max-14) * 24 * 60 * 60 * 1000);
                    dateovulation1 = datedans14jours1.toLocaleDateString("fr");
                    // pour avoir la date d'ovulation
                    this.dateovulation1 = dateovulation1;
                    deseignements1 = deseignements1.substring(6,10) + '-' + deseignements1.substring(3,5) + '-' + deseignements1.substring(0,2) + "T19:46Z";
                    dateovulation1 = dateovulation1.substring(6,10) + '-' + dateovulation1.substring(3,5) + '-' + dateovulation1.substring(0,2) + "T19:46Z";
                    var premieredate21 = new Date(dateovulation1).getTime();
                    var dateaujourdui21 = new Date().getTime();
                    var nombremilliseconde21 = premieredate21 -dateaujourdui21;
                    var nombresjours21 = Math.ceil(((((nombremilliseconde21 / 1000) / 60) / 60) / 24));
      

                    // pour la deuxieme dure du cycle


                    var datedans30jours2 = new Date(premieredate + duree_cycle_min * 24 * 60 * 60 * 1000);
                    deseignements2 = datedans30jours2.toLocaleDateString("fr");
                    this.datesegnement2 = deseignements2;
                    var datedans14jours2 = new Date(premieredate + (duree_cycle_min-14) * 24 * 60 * 60 * 1000);
                    dateovulation2 = datedans14jours2.toLocaleDateString("fr");
                    // pour avoir la date d'ovulation
                    this.dateovulation2 = dateovulation2;
                    deseignements2 = deseignements2.substring(6,10) + '-' + deseignements2.substring(3,5) + '-' + deseignements2.substring(0,2) + "T19:46Z";
                    dateovulation2 = dateovulation2.substring(6,10) + '-' + dateovulation2.substring(3,5) + '-' + dateovulation2.substring(0,2) + "T19:46Z";
                    var premieredate22 = new Date(dateovulation2).getTime();
                    var dateaujourdui22 = new Date().getTime();
                    var nombremilliseconde22 = premieredate22 -dateaujourdui22;
                    var nombresjours22 = Math.ceil(((((nombremilliseconde22 / 1000) / 60) / 60) / 24));
              
                   
                    if((nombresjours21>0)&&(this.testeur!=1)){

                          this.testeur = 21;
                          if(nombresjours21<=0){
                            this.nombrejrovulation1 = 1;
                          }else{
                            this.nombrejrovulation1 = nombresjours21;
                          }
                          
                          if(nombresjours22<=0){
                            this.nombrejrovulation2 = 1;
                          }else{
                            this.nombrejrovulation2 = nombresjours22;
                          }
                    }else if(this.testeur!=1){

                      this.testeur = 31;

                      var premieredate31 = new Date(deseignements1).getTime();
                      var dateaujourdui31 = new Date().getTime();
                      var nombremilliseconde31 = premieredate31 - dateaujourdui31;
                      var nombresjours31 = Math.ceil(((((nombremilliseconde31 / 1000) / 60) / 60) / 24));
                      this.nombrejourseignement1 = nombresjours31;

                      // dexieme date de seignement

                      var premieredate32 = new Date(deseignements2).getTime();
                      var dateaujourdui32 = new Date().getTime();
                      var nombremilliseconde32 = premieredate32 - dateaujourdui32;
                      var nombresjours32 = Math.ceil(((((nombremilliseconde32 / 1000) / 60) / 60) / 24));
                      this.nombrejourseignement2 = nombresjours32;

                      if(this.nombrejourseignement2<=3){
                          this.testeurovulation1 = 1;
                          this.datepdeseignement()
                      }

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

      

        if((this.testeur==1)&&(mode.intitule == "MODE GROSSESSE")){

       

              let loading = this.loadingCtrl.create();
              loading.present();
              this.checkProfile().then(next => {
                console.log(next);
                if (next) {
                  let loading2 = this.loadingCtrl.create();
                  loading2.present();

                

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
                                loading2.dismiss();
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
  
      }else{

          if(mode.intitule != "MODE GROSSESSE"){

              
                
              let loading = this.loadingCtrl.create();
              loading.present();
              this.checkProfile().then(next => {
                console.log(next);
                if (next) {
                  let loading2 = this.loadingCtrl.create();
                  loading2.present();

                

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
                                loading2.dismiss();
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
  

          }else{

            this.presentToast("vous n'avez pas un retard merci de bien vouloir mettre à jours votre profils");
          }
             

      }



  }


  datepdeseignement() {
    
    
    /*this.mylocalstorage.getSession().then((result:any) =>{
          console.log("=========================================");
          result.user._embedded.patient.debut_dernieres_menstrues = "madateepuis quoi"
          console.log(result.user._embedded.patient.debut_dernieres_menstrues );
          console.log("=========================================");
    })*/
    
    let alert = this.alertCtrl.create({
      title: 'Alerte seignement',
      message: 'Voulez vous metre à jours votre date de dernier règle ?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          handler: () => {
            
          
          }
        },
        {
          text: 'OUI',
          handler: () => {
            
            
            this.datePicker.show({
              date: new Date(),
              mode: 'date',
              androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then((date) => {
              
              //var datepv = new Date(JSON.stringify(date)).getTime();
              // update profile date des dernier règles
              
              this.mylocalstorage.getSession().then((result: any) => {
                result.user._embedded.patient.debut_dernieres_menstrues = date;
                this.mylocalstorage.storeSession(result).then(() => {
                  // c'est update doit aussi aller au serveur
                  
                  this.mylocalstorage.getSession().then((result: any) => {
                    var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
                    // this.mylocalstorage.setObjectUpdateProfile(this.object);
                    this.mylocalstorage.getObjectUpdateProfile().then((mode: any) => {
                      if (mode != null) {
                        mode.debut_dernieres_menstrues = dataprofile.substring(0, 16) + 'Z';
                        this.services.updateprofile(mode).subscribe(next => {
                          this.mylocalstorage.updatePatientStorage(next);
                        }, error => {
                        }, () => {
                          this.mylocalstorage.setObjectUpdateProfile(mode);
                        });
                      }
                    });
                   
                    // 280 jour pour donné naissance
                    
                  })
                  
                });
              })
              
            });
            
            
          }
        }
      ]
    });
    
    alert.present();
    
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


  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}



