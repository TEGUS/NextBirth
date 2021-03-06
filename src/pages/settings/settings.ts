import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {LocalStorageProvider} from "../../providers/localstorage.service";
import {ServiceProvider} from "../../providers/metier.service";
import {MyApp} from "../../app/app.component";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  langs = [];
  modes = [];
  defaultLang = null;
  defaultMode = null;
  chooseMode = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public localStorage: LocalStorageProvider,
              public translate: TranslateService, public loadingCtrl: LoadingController,
              public services: ServiceProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,
              public menuCtrl: MenuController) {
  }
  
  ionViewWillEnter() {
    this.initLanguages();
    
    this.initDefaultMode();
    
    this.getAllModes();
    
    this.localStorage.getDefaultLang().then(defaultLang => {
      this.defaultLang = defaultLang;
    });
  }
  
  initDefaultMode() {
    this.localStorage.getMode().then((mode: any) => {
      console.log(mode);
      if (mode !== null) {
        this.defaultMode = mode.code;
        this.chooseMode = mode.code;
      }
    });
  }
  
  initLanguages() {
    this.langs = [
      {
        label: 'français',
        code: 'fr'
      },
      {
        label: 'anglais',
        code: 'en'
      },
    ];
  }
  
  listenLangChange(event) {
    this.localStorage.setDefaultLang(event).then(lang => {
      this.translate.setDefaultLang(lang);
    });
  }
  
  listenModeChange(event) {
    let mode: any = this.modes.find(x => x.code === event);
    
    if (mode !== null) {
      console.log(mode);
      if (!mode.enable) {
        this.alertCtrl.create({
          message: 'Ce mode n\'est pas encore disponible.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.defaultMode = this.chooseMode;
              }
            }
          ]
        }).present();
        return;
      } else {
        this.chooseMode = mode.code;
        this.localStorage.storeModeInSession(mode);
      }
      
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  getAllModes() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getCategories().subscribe(next => {
      this.modes = [];
      next.forEach(m => {
        // if (m.enabled)
          this.modes.push(m)
      });
      console.log(this.modes);
    }, error => {
      loading.dismiss();
      console.log(error);
    }, () => {
      loading.dismiss();
    });
  }
  
  closeAccount() {
    this.alertCtrl.create({
      title: 'Supprimer mon compte Nextbirth',
      message: 'L\'opération de suppression de compte est irréversible. \nVoulez-vous continuer ?',
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Continuer',
          handler: () => {
            this.navCtrl.push('DeleteAccountPage')
          }
        }
      ]
    }).present();
  }
  
  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
}
