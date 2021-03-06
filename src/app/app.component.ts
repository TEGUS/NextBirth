import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {LocalStorageProvider} from "../providers/localstorage.service";
import * as codesMode from "../components/mode/mode";
import {ServiceProvider, Situation} from "../providers/metier.service";
import {TranslateService} from "@ngx-translate/core";

import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Globalization} from '@ionic-native/globalization';
import {Network} from "@ionic-native/network";
import {LocalNotifications} from "@ionic-native/local-notifications";
import * as v from "../variables/variables_";

import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = null;
  
  pages: Array<any>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public localStorage: LocalStorageProvider,
              public services: ServiceProvider, public menuCtrl: MenuController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, private sqlite: SQLite, public translate: TranslateService,
              private globalization: Globalization, private toastCtrl: ToastController,
              public network: Network, private localNotifications: LocalNotifications, private oneSignal: OneSignal) {
    
    this.services.initHeaders();
    this.intiliazedatabase();
    
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Accueil', component: "Start", icon: 'icon12'},
      {title: 'Mon Profil', component: "MyProfilePage", icon: 'icon3'},
      {title: 'Calendrier', component: "CalendarPage", icon: 'icon1'},
      {title: 'Mise en garde', component: "MessituationarisquePage", icon: 'icon2'},
      {title: 'Mes mises à jour', component: "MiseajourPage", icon: 'icon4'},
      {title: 'Parturiomètre', component: "SurveillancePage", icon: 'icon6'},
      {title: 'Pilulier', component: "PilulierPage", icon: 'icon9'},
      //{title: 'Conseils', component: "ConseilsPage", icon: 'icon9'},
      // {title: 'Humeur et état d\'esprit', component: "FluxReglePage", icon: 'icon11'},
      // {title: 'FAQ', component: "Img8Page", icon: 'icon7'},
      {title: 'Conseils', component: 'ConseilPage', icon: 'icon10'},
      {title: 'Paramètres', component: "SettingsPage", icon: 'icon8'},
      {title: 'A propos', component: 'AProposPage', icon: 'icon7'},
    ];

    this.initDefaultLang().then(() => {
      this.initializeApp();
    });
  }
  
  initializeApp() {

    
       
    this.platform.ready().then((readySource) => {
  
      try {
        this.initOneSignal();
      } catch (error) {
        console.log("=================================");
        console.log(error);
        console.log("=================================");
      }

       
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString("#eb5350");
      this.statusBar.styleLightContent();
      
      this.menuCtrl.enable(false);
      
      this.initValuesLocalStorage().then(() => {
        this.rootPage = null;
        // Get Root Page
        this.initRootPage().then(page => {
          this.rootPage = page
        });
      });
  
      this.checkLocalNotification();
    });
  }
  
  /**
   * Initialisations des valeurs dans le localstorage
   */
  initValuesLocalStorage() {
    return new Promise(resolve => {
      /**
       * Check All Countries and Store in LocalStorage
       */
      this.localStorage.getCountries().then(countries => {
        if (countries === null || countries === undefined) {
          this.services.getAllCountries().subscribe(countries => {
            this.localStorage.setCountries(countries);
            resolve();
          }, error => {
            console.error(error)
            resolve();
          })
        } else {
          resolve();
        }
      })
    });
  }
  
  initRootPage() {
    console.log("initRootPage");
    return new Promise((resolve, reject) => {
      this.localStorage.getKey('session').then(next => {
        if (next !== null) {
          this.menuCtrl.enable(true, 'sideMenu');
          this.localStorage.getKey('mode').then(mode => {
            console.log(mode);
            if (mode !== null) {
              switch (mode.code) {
                case codesMode.CONTPL:
                  resolve("ModeContraceptionPage");
                  break;
                case codesMode.CONTPR:
                  resolve("ModeContraceptionPage");
                  break;
                case codesMode.GEST:
                  resolve("ReportPage");
                  break;
                case codesMode.GRS:
                  this.checkProfileDesirGrossesse().then((next: any) => {
                    console.log(next);
                    resolve(next.status ? "ReportPage" : "QuestionContraceptionPage");
                  }, error => {
                    console.error(error);
                    resolve("QuestionContraceptionPage");
                  });
                  break;
              }
            } else {
              resolve("ChooseModePage");
            }
          }, error => {
            console.error(error);
            resolve("ChooseModePage");
          });
        } else {
          resolve("LoginPage");
        }
      }, error => {
        console.log(error);
      });
    })
  }
  
  checkProfileDesirGrossesse() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.checkProfileDesirGrossesse().subscribe(next => {
        console.log(next);
        resolve(next);
        loading.dismiss();
      }, error => {
        reject(error);
        loading.dismiss();
      })
    });
  }
  
  /**
   * Initialisation de la langue par défaut
   */
  initDefaultLang() {
    return new Promise(resolve => {
      this.globalization.getPreferredLanguage().then(res => {
        console.log(res.value);  // fr-CM
        const lang = (res.value).split('-')[0];
        
        this.localStorage.getDefaultLang().then(defaultLang => {
          if (defaultLang === null || defaultLang === '') {
            this.localStorage.setDefaultLang(lang).then(lang => {
              this.translate.setDefaultLang(lang);
              resolve();
            });
          } else {
            this.translate.setDefaultLang(defaultLang);
            resolve();
          }
        });
      }, e => {
        console.error(e + " for globalization.getPreferredLanguage()");
        this.localStorage.getDefaultLang().then(defaultLang => {
          if (defaultLang === null || defaultLang === '') {
            this.localStorage.setDefaultLang('fr').then(lang => {
              this.translate.setDefaultLang(lang);
              resolve();
            });
          } else {
            this.translate.setDefaultLang(defaultLang);
            resolve();
          }
        });
      });
    })
  }
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != null) {
      switch (page.component) {
        case "Start":
          this.initRootPage().then(page => {
            this.nav.setRoot(page);
          });
          break;
        case "CalendarPage":
          this.localStorage.getKey('mode').then(mode => {
            console.log(mode)
            if (mode === null) {
              this.presentToast("Veuillez Choisir Un Mode !");
              this.nav.setRoot('ChooseModePage', {});
            } else {
              this.nav.setRoot(
                (mode !== null && mode.code === "MO1") ?
                  "TimelinetestPage" : "CalendarPage"
              );
            }
          });
          break;
        default:
          this.nav.setRoot(page.component);
          break;
      }
    }
  }


  private initOneSignal() {

    this.oneSignal.startInit('750ec2b4-94d2-4cf0-91c4-fa765fa3ae02', '531280430695');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((data) => {
    // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // do something when a notification is opened

       //this.navCtrl.push('NotificationPage');
       
       /*var notifica = data.notification;

       alert(notifica);
       
       alert(data.notification['body']);

       this.alertCtrl.create({
        
           message: '' + data.notification,
       
       }).present();*/

        
    });

    this.getUserOneSignalID();

      this.oneSignal.endInit();
    }

    private getUserOneSignalID() {
      this.oneSignal.getIds().then(data => {
         //alert(JSON.stringify(data));
         
      });



    }


  
  signOut() {
    this.alertCtrl.create({
      message: 'Voulez-vous vraiment vous déconnecter ? ',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.localStorage.clearStorage().then(next => {
              this.menuCtrl.enable(false);
              this.initDefaultLang().then(() => {
                this.initValuesLocalStorage().then(() => {
                  this.nav.setRoot("LoginPage");
                });
              });
            }, error => {
              console.log(error);
            })
          }
        }
      ]
    }).present();
  }
  
  presentToast(message: any, duration = 5000) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
  
  /**
   * Init SQLITE DB
   */
  intiliazedatabase() {
    this.sqlite.create({
      name: 'nextbirth.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SITUATIONS (id integer primary key, date, titre, description, idNotif unique)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
 
      db.executeSql('CREATE TABLE IF NOT EXISTS CONSEILS (id integer primary key, date, titre, description)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));


    }).catch(e => console.log(e));
  }
  
  
  /**
   * Notification Events Action
   */
  checkLocalNotification() {
    this.localNotifications.on('click').subscribe((next) => {
      this.storeMiseEnGarde(next);
    }, error => console.error(error));

    this.localNotifications.on('trigger').subscribe((next) => {
      this.storeMiseEnGarde(next, false);
    }, error => console.error(error));

    this.localNotifications.on('clear').subscribe((next) => {
      this.storeMiseEnGarde(next, false);
    }, error => console.error(error));

    this.localNotifications.on('clearAll').subscribe((next) => {
      this.storeMiseEnGarde(next, false);
    }, error => console.error(error));

    this.localNotifications.on('schedule').subscribe((next) => {
      this.storeMiseEnGarde(next, false);
    }, error => console.error(error));

    this.localNotifications.on(`TAKE`).subscribe(next => {
      this.storeMiseEnGarde(next);
      this.makeTakingTreatment(next.data.idNotif).then(on => {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.services.takedMedicament(next.id).subscribe(r => {
          loading.dismiss();
          this.presentToast('Prise de médicament Enrégistré !');
        });
      });
    }, error => console.error(error));
    
    // this.localNotifications.on(`OPEN`).subscribe(next => {
    //   this.storeMiseEnGarde(next);
    // }, error => console.error(error));
  }
  
  storeMiseEnGarde(item, open = true) {
    // Chargement des mises en garde
    this.services.getAllSituations().then((misesEnGarde: Array<Situation>) => {
      // Création des éléments dans mise en garde
      if (misesEnGarde.find(x => x.idNotif === item.data.idNotif) === undefined) {
        this.services.createSituations({
          date: new Date(),
          titre: item.data.title,
          description: item.data.description,
          idNotif: item.data.idNotif
        }).then(() => {
          if (open) {
            this.nav.root('MessituationarisquePage')
          }
        }, error => {
          console.error(error);
        });
      } else {
        if (open) {
          this.nav.root('MessituationarisquePage')
        }
      }
    });
  }
  
  makeTakingTreatment(id_alert) {
    return new Promise(resolve => {
      this.localStorage.getKey(v.LOCAL_STRG_TAKED_TREATEMENT).then((res: any) => {
        // this.presentDialogAlert(JSON.stringify(res));
        if (res !== undefined && res !== null) {
          res.push(id_alert);
        } else {
          res = [];
          res.push(id_alert);
        }
        this.localStorage.setKey(v.LOCAL_STRG_TAKED_TREATEMENT, res).then(on => {
          resolve(true);
        });
      });
    })
  }
}
