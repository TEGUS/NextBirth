import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication";
import {SignUpPage} from "../sign-up/sign-up";
import {checkField} from "../../variables/functions";
import {LocalstorageProvider} from '../../providers/localstorage';

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
  object = null
  error = null

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthenticationProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public mylocalstorage: LocalstorageProvider) {

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
        this.mylocalstorage.storeSession(next).then(() => {});
        this.navCtrl.setRoot('ChooseModePage', {});
      }, error => {
        loading.dismiss();
        console.log(error);
        this.error = error.error;
        console.log(this.error);
      }, () => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.presentToast('Finish Login!');
        });
      });
    } else {
      this.error = {
        message: 'Veuillez remplir touts les champs!'
      }
    }
  }

  signup() {
    this.navCtrl.push(SignUpPage);
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
