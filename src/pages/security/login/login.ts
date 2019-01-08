import {Component} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {AuthenticationProvider} from "../../../providers/authentication";
import {SignUpPage} from "../sign-up/sign-up";
import {checkField} from "../../../variables/functions";
import {LocalStorageProvider} from '../../../providers/localstorage';
import {ServiceProvider} from '../../../providers/service';
import {MbscSelectOptions} from "@mobiscroll/angular";
import {MyApp} from "../../../app/app.component";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  object = null;
  error = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthenticationProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public mylocalstorage: LocalStorageProvider,
              public menuCtrl: MenuController, public services: ServiceProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLoad() {
    this.object = {
      email: null,
      plainPassword: null
    }
  }

  getEmail(email) {
    this.object.email = email
  }

  getPassword(pwd) {
    this.object.plainPassword = pwd
  }

  login() {
    if (checkField(this.object.email) && checkField(this.object.plainPassword)) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.authProvider.logIn(this.object).subscribe(next => {
        console.log(next);
        
        this.mylocalstorage.storeSession(next).then(() => {
          this.services.faitTravail();
          
          this.mylocalstorage.storeKeydpv(0).then(() => {});
          this.mylocalstorage.storeKeydpvacc(0).then(() => {});
  
          this.services.getMode().subscribe(mode => {
            if (mode !== null) {
              this.mylocalstorage.storeModeInSession(mode._embedded.categorie);
              this.navCtrl.setRoot(MyApp)
            } else {
              this.navCtrl.setRoot('ChooseModePage', {});
            }
            
            loading.dismiss();
            this.menuCtrl.enable(true, 'sideMenu');
          }, error => {
            console.error(error);
            loading.dismiss();
          });
        });
        
      }, error => {
        loading.dismiss();
        console.log(error);
        this.error = error.error;
        console.log(this.error);

        if (this.error.error != undefined && this.error.error.code === 500) {
          let alert = this.alertCtrl.create({
            title: 'Internal Server error',
            subTitle: '500',
            message: 'Internal Server error',
            buttons: ['Okay']
          });
          alert.present();
        }
      }, () => {

      });
    } else {
      this.error = {
        message: 'Veuillez remplir touts les champs!'
      }
    }
  }

  signup() {
    this.navCtrl.push("SignUpPage");
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
