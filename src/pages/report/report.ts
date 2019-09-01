import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ModalOptions,
  Modal,
  ToastController
} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {ServiceProvider} from "../../providers/metier.service";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';
import {LocalStorageProvider} from '../../providers/localstorage.service';
import {DatePicker} from '@ionic-native/date-picker';
import {formatNumberOfDate, getCurrentDateWith} from "../../variables/functions";


@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  items = [];

  public KEY_SCHEDULE_DIALOG_VACCIN_ANTI_TETANIQUE = "SCHEDULE_DIALOG_VACCIN_ANTI_TETANIQUE";

  public testeurdpv = 0;
  public testeurdpvcac = 0;
  public pagenumber = 1;
  public page = 1;
  public listevide = 1;

  public noteGrosesse = {
    libele: "",
    description: '0',
    image: '0'
  }

  public nombresemaine: any;
  public nombrejourrestant: any;
  public dpa: any;
  public dpv: any;
  public dpvacc: any;
  public imageaafficher = "";
  acticlesSubscription: any;

  constructor(public navCtrl: NavController, public mylocalstorage: LocalStorageProvider, public toastCtrl: ToastController,
              private modal: ModalController, private alertCtrl: AlertController,
              private base64: Base64, public navParams: NavParams, private localNotifications: LocalNotifications,
              public loadingCtrl: LoadingController, private camera: Camera, public services: ServiceProvider,
              private datePicker: DatePicker) {

    this.testeurdpv = 0;
    this.testeurdpvcac = 0;
    this.services.initHeaders();

    ////////////////////// si les conseil n'ont pas encore été programmé alors les programmé ////////////
  
    
     this.mylocalstorage.getValideconseil().then((result: any) => {

           if(result!=null){

              if(result.value != 10){

                this.services.getConseils().subscribe(next => {

                
                        let listesNotification = [];
                        var i = 0;
                        next.items.forEach((element) => {
                          let manotification = {
                            id: i + 1,
                            text: element.description,
                            trigger: {at: new Date(new Date().getTime() + (60*1000*60*24)*(i+1))},
                            //trigger: {at: new Date((new Date(element.date_alert)).getTime())},
                            led: 'FF0000',
                            sound: 'file://assets/imgs/notification.mp3'
                          }
    
                          listesNotification.push(manotification);
                          i++;
                        });
    
                        if (i == next.items.length) {
                          this.localNotifications.schedule(
                            listesNotification
                          );
    
                          var donnee = {
                            value:10
                          }
                          this.mylocalstorage.storeValideconseilInSession(donnee).then((result: any) => {
      
                          })
    
    
                        }

                
                }, error => {
                  console.error(error);
                });
              }

            }


            
      });
     ////////////////////////////////////////////////////////////////////////////////////////////////

  }

  ionViewWillEnter() {

  }






  ionViewDidLoad() {

    this.services.initHeaders();



    




    let loading = this.loadingCtrl.create();
    loading.present();
    this.acticlesSubscription = this.services.getArticles(this.pagenumber).subscribe(next => {
      loading.dismiss();
      this.items = next.items;
      if (this.items.length == 0) {
        this.listevide = 2;
      }
    }, error => {
      loading.dismiss();
      console.error(error);
    });

    setTimeout(() => {
      loading.dismiss();
      this.acticlesSubscription.unsubscribe();
      // this.presentToast("Veuillez vérifier votre connection internet !");
    }, 15000);

    console.log('ionViewDidLoad ReportPage');




    this.mylocalstorage.getTesteur().then((result: any) => {

        this.declancherAlerte("De nouveaux article peuvent vous interesser sur NextBirth", (2));
        this.declancherAlerte("De nouveaux article peuvent vous interesser sur NextBirth", (60));
        this.declancherAlerte("Vous allez recevoir des notifications tous les 3 jours", 10);
     
              if(result == 0){
                  for (let i = 1; i <= 90; i++) {
                        this.declancherAlerte("De nouveaux article peuvent vous interesser sur NextBirth", (518400*i));
                        if(i==10){
                          var donnee = {
                            value:10
                          }
                          this.mylocalstorage.storeTesteur(donnee).then((result: any) => {

                          })
                        }
                  }
              }
    },error => {
      alert(JSON.stringify(error));
      console.error(error)
    });
          
              




    this.mylocalstorage.getSession().then((result: any) => {
      if (result.user !== null && result.user._embedded.photo !== null) {
        this.imageaafficher = result.user._embedded.photo._embedded.url_photo;
      } else {
        this.imageaafficher = 'assets/imgs/user.jpg';
      }
    }, error => {
      console.error(error)
    });


    this.mylocalstorage.getKeydpv().then((result: any) => {

      var dateaujourdui = new Date().getTime();
      var datepv = result;
      var nombremilliseconde = datepv - dateaujourdui;
      var nombresjourspv = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));


      if (nombresjourspv > 0) {
        this.dpv = nombresjourspv;
        this.testeurdpv = 1;
      } else if (nombresjourspv == 1) {

        // Bonjour Rahim n'oubliez pas votre visite demain demain
        this.mylocalstorage.getSession().then((result: any) => {
          this.presentToast("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui");
          this.declancherAlerte("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui", 2);
        }, error => {
          console.error(error)
        });

      } else {
        this.testeurdpv = 0;
      }

    }, error => {
      console.error(error)
    });


    this.mylocalstorage.getKeydpvacc().then((result: any) => {

      var dateaujourdui = new Date().getTime();
      var datepv = result;
      var nombremilliseconde = datepv - dateaujourdui;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));


      if (nombresjours > 0) {
        this.dpvacc = nombresjours;
        if(this.dpvacc == 1){
          
          // notification
          this.mylocalstorage.getSession().then((result: any) => {
            this.presentToast("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui");
            this.declancherAlerte("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui", 2);
          }, error => {
            console.error(error)
          });

        }
        this.testeurdpvcac = 1;
      } else if (nombresjours == 1) {

        // Bonjour Rahim n'oubliez pas votre vaccin demain

        this.mylocalstorage.getSession().then((result: any) => {
          this.presentToast("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui demain");
          this.declancherAlerte("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui demain", 2);
        }, error => {
          console.error(error)
        });

      } else {
        this.testeurdpvcac = 0;
      }
    }, error => {
      console.error(error)
    });


    this.mylocalstorage.getSession().then((result: any) => {


      var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
      var ladate = dataprofile.substring(0, 16) + 'Z';
      var premieredate = new Date(ladate).getTime();
      var dateaujourdui = new Date().getTime();
      var nombremilliseconde = dateaujourdui - premieredate;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));


      var nomrejoursavantacc = 280 - nombresjours;
      if (nomrejoursavantacc < 0) {
        this.alertechangementdatederneirregles();
      }
      this.nombrejourrestant = (nombresjours) % 7;
      this.nombresemaine = Math.floor((nombresjours) / 7);
      var time = new Date().getTime();
      var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
      this.dpa = dateaccouchement.toLocaleDateString("fr");

      var dateaujourdui = new Date().getTime();
      var datepv = result;
      var nombremilliseconde = datepv - dateaujourdui;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));


      //Check Date Vacin Anti Tétanique
      this.mylocalstorage.getKey('mode').then(m => {
        if (m !== undefined && m !== null && m.code === 'MO1') {
          this.mylocalstorage.getKey(this.KEY_SCHEDULE_DIALOG_VACCIN_ANTI_TETANIQUE).then(schedule => {
            if (schedule === null || schedule === (new Date())) {
              this.mylocalstorage.setKey(this.KEY_SCHEDULE_DIALOG_VACCIN_ANTI_TETANIQUE, getCurrentDateWith((new Date()), 1));
              this.checkDateVaccinAntiTetanique(result.user._embedded.patient.date_vaccin_anti_tetanique);
            }
          });
        }
      })
    }, error => {
      console.error(error)
    });


    this.mylocalstorage.getKeydpvacc().then((result: any) => {

      var dateaujourdui = new Date().getTime();
      var datepv = result;
      var nombremilliseconde = datepv - dateaujourdui;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));


      if (nombresjours > 0) {
        this.dpvacc = nombresjours;
        if(this.dpvacc == 1){
          // notification
          this.mylocalstorage.getSession().then((result: any) => {
            this.presentToast("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui");
            this.declancherAlerte("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui", 2);
          }, error => {
            console.error(error)
          });
        }
        this.testeurdpvcac = 1;
      } else {
        this.testeurdpvcac = 0;
      }
    }, error => {
      console.error(error)
    });


    this.mylocalstorage.getSession().then((result: any) => {
      var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
      var ladate = dataprofile.substring(0, 16) + 'Z';
      var premieredate = new Date(ladate).getTime();
      var dateaujourdui = new Date().getTime();
      var nombremilliseconde = dateaujourdui - premieredate;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
      var nomrejoursavantacc = 280 - nombresjours;
      if (nomrejoursavantacc < 0) {
        this.alertechangementdatederneirregles();

      }
      this.nombrejourrestant = (nombresjours) % 7;
      this.nombresemaine = Math.floor((nombresjours) / 7);
      var time = new Date().getTime();
      var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
      this.dpa = dateaccouchement.toLocaleDateString("fr");

      // 280 jour pour donné naissance

    });
  }

  


  doInfiniteBottom(infiniteScroll) {
    setTimeout(() => {


      this.nextPageArticle().then((next: any) => {

        this.items = this.items.concat(next);

      }, error => {
        console.error(error);
      });

      infiniteScroll.complete();
    }, 5000);
  }


  selectArticle(article) {
    this.navCtrl.push("ArticleDetailPage", {
      article: article
    })
  }


  /**
   * Check Date Vaccin antiténatique
   * @param dateVaccinAntiTetanique
   */
  checkDateVaccinAntiTetanique(dateVaccinAntiTetanique) {
    if (dateVaccinAntiTetanique !== undefined && dateVaccinAntiTetanique !== null) {
      return;
    }

    let alert = this.alertCtrl.create({
      title: 'Vaccin Antitétanique',
      message: 'Avez vous déjà reçu un vaccin antitétanique ?',
      buttons: [
        {
          text: 'NON',
          handler: () => {
            let a = this.alertCtrl.create({
              message: 'Faites-vous vacciner au plus tôt contre le tétanos pour vous protéger et protéger votre enfant!',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                  }
                }
              ]
            })
            a.present()
          }
        },
        {
          text: 'OUI',
          handler: () => this.showDialogDateVaccinAntiTetanique()
        }
      ]
    });
    alert.present()
  }

  /**
   * Show Dialog to put date vaccin antitétanique
   */
  showDialogDateVaccinAntiTetanique() {
    this.datePicker.show({
      titleText: 'Quand avez-vous pris la première dose du vaccin antitétanique ?',
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      doneButtonLabel: 'Valider',
      cancelButtonLabel: 'Annuler',
      minDate: new Date(),
    }).then((date) => {
      console.clear();
      console.log(date)

      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.updateprofile({
        date_vaccin_anti_tetanique: `${formatNumberOfDate(date.getDate())}-${formatNumberOfDate(date.getMonth())}-${date.getFullYear()}`
      }).subscribe(next => {
        console.log(next)
        loading.dismiss()
        this.mylocalstorage.updatePatientStorage(next);
      }, err => {
        console.error(err)
        loading.dismiss()
      });
    }, err => {
      console.error(err)
    });
  }


  datapick() {
    let alert = this.alertCtrl.create({
      title: 'Date Prochain Visite',
      message: 'Voulez vous renseigner la date de la prochaine visite ?',
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
              var dateaujourdui = new Date().getTime();
              var datepv = date.getTime();
              var nombremilliseconde = datepv - dateaujourdui;
              var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
              this.dpv = nombresjours;
              if (this.dpv > 0) {
                this.mylocalstorage.storeKeydpv(datepv).then(() => {
                });
                this.testeurdpv = 1;
              }

            });
          }
        }
      ]
    });
    alert.present();
  }


  dateprochainvacc() {

    let alert = this.alertCtrl.create({
      title: 'Date Prochain Vaccin',
      message: 'Voulez vous renseigner la date du prochain vaccin ?',
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
              var data = {
                "date_visite": date
              }

              this.services.dateprochaineVisite(data).subscribe(next => {
                this.items = next
              }, error => {
              }, () => {
              });


              var dateaujourdui = new Date().getTime();
              var datepv = date.getTime();
              var nombremilliseconde = datepv - dateaujourdui;
              var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
              this.dpvacc = nombresjours;
              if(this.dpvacc == 1){

                this.mylocalstorage.getSession().then((result: any) => {
                  this.presentToast("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui");
                  this.declancherAlerte("Bonjour " + result.user.username + " noubliez pas votre visite prenatale demain/aujourd'hui", 2);
                }, error => {
                  console.error(error)
                });
                // notification
              }
              if (this.dpvacc > 0) {
                this.mylocalstorage.storeKeydpvacc(datepv).then(() => {
                });
                this.testeurdpvcac = 1;
              }

            });


          }
        }
      ]
    });

    alert.present();

  }


  dateprodacc() {


    /*this.mylocalstorage.getSession().then((result:any) =>{
          console.log("=========================================");
          result.user._embedded.patient.debut_dernieres_menstrues = "madateepuis quoi"
          console.log(result.user._embedded.patient.debut_dernieres_menstrues );
          console.log("=========================================");
    })*/

    let alert = this.alertCtrl.create({
      title: 'Date Probable accouchement',
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
                    var ladate = dataprofile.substring(0, 16) + 'Z';
                    var premieredate = new Date(ladate).getTime();
                    var dateaujourdui = new Date().getTime();
                    var nombremilliseconde = dateaujourdui - premieredate;
                    var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
                    var nomrejoursavantacc = 280 - nombresjours;
                    this.nombrejourrestant = (nombresjours) % 7;
                    this.nombresemaine = Math.floor((nombresjours) / 7);
                    var time = new Date().getTime();
                    var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
                    this.dpa = dateaccouchement.toLocaleDateString("fr");

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


  alertechangementdatederneirregles() {


    /*this.mylocalstorage.getSession().then((result:any) =>{
          console.log("=========================================");
          result.user._embedded.patient.debut_dernieres_menstrues = "madateepuis quoi"
          console.log(result.user._embedded.patient.debut_dernieres_menstrues );
          console.log("=========================================");
    })*/

    let alert = this.alertCtrl.create({
      title: 'Vous avez sans doute déjà mis au monde votre bébé',
      message: 'Voulez vous mettre à jour votre date d\'accouchement tout suite pour mieux profiter de nos service ? ',
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
                          this.navCtrl.setRoot('ChooseModePage', {});
                        }, error => {
                        }, () => {
                          this.mylocalstorage.setObjectUpdateProfile(mode);
                        });
                      }
                    });
                    var ladate = dataprofile.substring(0, 16) + 'Z';
                    var premieredate = new Date(ladate).getTime();
                    var dateaujourdui = new Date().getTime();
                    var nombremilliseconde = dateaujourdui - premieredate;
                    var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
                    var nomrejoursavantacc = 280 - nombresjours;
                    this.nombrejourrestant = (nombresjours) % 7;
                    this.nombresemaine = Math.floor((nombresjours) / 7);
                    var time = new Date().getTime();
                    var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
                    this.dpa = dateaccouchement.toLocaleDateString("fr");

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


  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Bien Vouloir saisir le bon moment',
      inputs: [
        {
          name: 'libele',
          placeholder: 'libele'
        },
        {
          name: 'description',
          placeholder: 'Description'

        }

      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Valider',
          handler: data => {
            this.noteGrosesse.libele = data.libele;
            this.noteGrosesse.description = data.description;
          }
        }
      ]
    });
    alert.present();
  }

  takenote() {
    this.presentPrompt()
  }


  takephotos() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: 1,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = ImageData;
      this.base64.encodeFile(base64Image).then((base64File: string) => {

        this.noteGrosesse.image = base64File;

      }, (err) => {
      })


    }, (err) => {

    })
  }


  openModalImage() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      name: 'Paul Halliday',
      occupation: 'Developer',
      image: 1,
      note: 0
    };

    const myModal: Modal = this.modal.create('MonmodalPage', {data: myModalData}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {

    });

  }


  openModalNote() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      name: 'Paul Halliday',
      occupation: 'Developer',
      image: 0,
      note: 1
    };

    const myModal: Modal = this.modal.create('MonmodalPage', {data: myModalData}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {

    });

  }

  mesbonmoment() {
    this.navCtrl.push("MesbonmomentPage", {})
  }


  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000
    });
    toast.present();
  }

  declancherAlerte(message: any, nombreseconde: any) {

    this.localNotifications.schedule({
      text: message,
      trigger: {at: new Date(new Date().getTime() + nombreseconde * 1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });

  }


  nextPageArticle() {

    return new Promise(resolve => {
      this.pagenumber = this.pagenumber + 1;
      this.acticlesSubscription = this.services.getArticles(this.pagenumber).subscribe(next => {
        resolve(next.items);
      }, error => {

      }, () => {

      });
    })
  }


}


